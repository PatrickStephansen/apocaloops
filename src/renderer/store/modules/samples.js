import { join } from 'path';
import { promisify } from 'util';
import { access, mkdir, readdir, copyFile } from 'fs';

import { samplePlayer } from '../../services/sample-player';

const exists = promisify(access);
const readdirPromise = promisify(readdir);
const readDir = path => readdirPromise(path);
const copyDir = (sourcePath, destinationPath) =>
	readDir(sourcePath).then(paths => {
		const copy = promisify(copyFile);
		return Promise.all(
			paths.map(p => copy(join(sourcePath, p), join(destinationPath, p)))
		);
	});
const createDirectory = promisify(mkdir);

const state = {
	libraryDirectory: '',
	bankDirectories: [],
	channels: [
		{
			selectedBankDirectory: '',
			sampleFilePaths: [],
			selectedSampleFilePath: '',
			gain: 1
		},
		{
			selectedBankDirectory: '',
			sampleFilePaths: [],
			selectedSampleFilePath: '',
			gain: 1
		}
	],
	errors: []
};
samplePlayer.setupChannels(2);

// don't call these externally, call actions instead
const mutations = {
	setLibraryDirectory(state, libraryDirectory) {
		state.libraryDirectory = libraryDirectory;
	},
	setBankDirectories(state, { bankDirectories }) {
		state.bankDirectories = bankDirectories;
	},
	selectBankDirectory(state, { bankDirectory, channelNumber }) {
		state.channels[channelNumber].selectedBankDirectory = bankDirectory;
	},
	setSampleFilePaths(state, { sampleFilePaths, channelNumber }) {
		state.channels[channelNumber].sampleFilePaths = sampleFilePaths;
	},
	selectSampleFilePath(state, { selectedSampleFilePath, channelNumber }) {
		state.channels[
			channelNumber
		].selectedSampleFilePath = selectedSampleFilePath;
	},
	setChannelGain(state, { gain, channelNumber }) {
		state.channels[channelNumber].gain = gain;
	},
	addError(state, error) {
		state.errors.push(error);
	}
};

const packagedSamplesDirectory = 'noise-drums';

const actions = {
	setLibraryDirectory({ commit, dispatch, state }, { libraryDirectory }) {
		if (!libraryDirectory) {
			return Promise.reject(new Error('nothing given for libraryDirectory'));
		}
		commit('setLibraryDirectory', libraryDirectory);
		return exists(libraryDirectory)
			.catch(() => createDirectory(libraryDirectory))
			.then(() => readDir(libraryDirectory))
			.then(banks => {
				if (!banks.some(b => b === packagedSamplesDirectory)) {
					const destinationDirectory = join(
						libraryDirectory,
						packagedSamplesDirectory
					);
					return createDirectory(destinationDirectory)
						.then(() =>
							copyDir(
								join(__static, packagedSamplesDirectory),
								destinationDirectory
							)
						)
						.then(() => [...banks, packagedSamplesDirectory]);
				}
				return banks;
			})
			.then(banks => {
				const bankPaths = banks.map(bank => join(libraryDirectory, bank));
				commit('setBankDirectories', {
					bankDirectories: bankPaths
				});
				if (!bankPaths.length) {
					return Promise.resolve();
				}
				return Promise.all(
					state.channels.map((channel, channelNumber) =>
						dispatch('selectBank', { bankPath: bankPaths[0], channelNumber })
					)
				);
			})
			.catch(e => commit('addError', e));
	},
	selectBank({ commit, dispatch }, { bankPath, channelNumber }) {
		commit('selectBankDirectory', { bankDirectory: bankPath, channelNumber });
		return readDir(bankPath)
			.then(samples => {
				const samplePaths = samples.map(sample => ({
					path: join(bankPath, sample),
					name: sample
				}));
				commit('setSampleFilePaths', {
					sampleFilePaths: samplePaths.map(sample => sample.path),
					channelNumber
				});
				return samplePlayer.loadSamples(samplePaths).then(() => {
					if (!samplePaths.length) {
						return Promise.resolve();
					}
					return dispatch('selectSample', {
						samplePath: samplePaths[0].path,
						channelNumber
					});
				});
			})
			.catch(e => commit('addError', e));
	},
	selectSample({ commit, getters }, { samplePath, channelNumber }) {
		commit('selectSampleFilePath', {
			selectedSampleFilePath: samplePath,
			channelNumber
		});
		samplePlayer.playSample(
			getters.selectedSamplePerChannel.find(
				channel => channel.channelNumber === channelNumber
			).samplePath,
			channelNumber
		);
	},
	setChannelGain({ commit }, { gain, channelNumber }) {
		commit('setChannelGain', { gain, channelNumber });
		samplePlayer.setChannelGain(gain, channelNumber);
	}
};

const getters = {
	selectedSamplePerChannel: ({ channels }) =>
		channels.map((channel, channelNumber) => ({
			channelNumber,
			sampleFileName: channel.selectedSampleFilePath.slice(
				channel.selectedBankDirectory.length + 1
			),
			samplePath: channel.selectedSampleFilePath
		})),
	banks: ({ bankDirectories, libraryDirectory }) =>
		bankDirectories.map(bankPath => ({
			path: bankPath,
			name: bankPath.slice(libraryDirectory.length + 1)
		})),
	selectedBankPerChannel: ({ channels, libraryDirectory }) =>
		channels.map((channel, channelNumber) => ({
			channelNumber,
			name: channel.selectedBankDirectory.slice(libraryDirectory.length + 1),
			path: channel.selectedBankDirectory
		})),
	samplesPerChannel: ({ channels }) =>
		channels.map((channel, channelNumber) => ({
			channelNumber,
			samples: channel.sampleFilePaths.map(path => ({
				path,
				name: path.slice(channel.selectedBankDirectory.length + 1)
			}))
		}))
};

export default {
	state,
	mutations,
	actions,
	getters
};

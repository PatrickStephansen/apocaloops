import { join } from 'path';
import { promisify } from 'util';
import { access, mkdir, readdir } from 'fs';

import { samplePlayer } from '../../services/sample-player';

const exists = promisify(access);
const readdirPromise = promisify(readdir);
const readDir = path => readdirPromise(path, { encoding: 'utf-8' });

const state = {
	libraryDirectory: '',
	bankDirectories: [],
	selectedBankDirectory: '',
	sampleFilePaths: [],
	selectedSampleFilePath: '',
	errors: []
};

// don't call these externally, call actions instead
const mutations = {
	setLibraryDirectory(state, libraryDirectory) {
		state.libraryDirectory = libraryDirectory;
	},
	setBankDirectories(state, bankDirectories) {
		state.bankDirectories = bankDirectories;
	},
	selectBankDirectory(state, bankDirectory) {
		state.selectedBankDirectory = bankDirectory;
	},
	setSampleFilePaths(state, sampleFilePaths) {
		state.sampleFilePaths = sampleFilePaths;
	},
	selectSampleFilePath(state, selectedSampleFilePath) {
		state.selectedSampleFilePath = selectedSampleFilePath;
	},
	addError(state, error) {
		state.errors.push(error);
	}
};

const actions = {
	setLibraryDirectory({ commit, dispatch }, { libraryDirectory }) {
		if (!libraryDirectory) {
			return Promise.reject(new Error('nothing given for libraryDirectory'));
		}
		commit('setLibraryDirectory', libraryDirectory);
		return exists(libraryDirectory)
			.catch(() => mkdir(libraryDirectory))
			.then(() => readDir(libraryDirectory))
			.then(banks => {
				const bankPaths = banks.map(bank => join(libraryDirectory, bank));
				commit('setBankDirectories', bankPaths);
				return dispatch('selectBank', { bankPath: bankPaths[0] });
			});
	},
	selectBank({ commit, dispatch }, { bankPath }) {
		commit('selectBankDirectory', bankPath);
		return readDir(bankPath)
			.then(samples => {
				const samplePaths = samples.map(sample => ({
					path: join(bankPath, sample),
					name: sample
				}));
				commit('setSampleFilePaths', samplePaths.map(sample => sample.path));
				return samplePlayer.loadSamples(samplePaths).then(() => {
					if (!samplePaths.length) {
						return Promise.resolve();
					}
					return dispatch('selectSample', { samplePath: samplePaths[0].path });
				});
			})
			.catch(e => commit('addError', e));
	},
	selectSample({ commit, getters }, { samplePath }) {
		commit('selectSampleFilePath', samplePath);
		samplePlayer.playSample(getters.selectedSampleFileName);
	}
};

const getters = {
	selectedSampleFileName: ({ selectedSampleFilePath, selectedBankDirectory }) =>
		selectedSampleFilePath.slice(selectedBankDirectory.length + 1),
	banks: ({ bankDirectories, libraryDirectory }) =>
		bankDirectories.map(bankPath => ({
			path: bankPath,
			name: bankPath.slice(libraryDirectory.length + 1)
		})),
	samples: ({ selectedBankDirectory, sampleFilePaths }) =>
		sampleFilePaths.map(path => ({
			path,
			name: path.slice(selectedBankDirectory.length + 1)
		}))
};

export default {
	state,
	mutations,
	actions,
	getters
};

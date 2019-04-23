import { readFile } from 'fs';
import { promisify } from 'util';
import decode from 'audio-decode';
import 'flac.js';
import 'mp3.js';
import 'opus.js';
import 'vorbis.js';

let buffers = new Map();
let channelGain = [];
const audioContext = new AudioContext();
const channelSplitter = new ChannelSplitterNode(audioContext, {
	numberOfOutputs: 1
});
const channelMerger = new ChannelMergerNode(audioContext, {
	numberOfInputs: 1
});
channelMerger.connect(audioContext.destination);
channelSplitter.connect(channelMerger);

const readToAudioBuffer = filePath =>
	promisify(readFile)(filePath).then(buffer =>
		decode(buffer, { context: audioContext })
	);

export const samplePlayer = {
	setupChannels(numberOfChannels) {
		for (
			let channelIndex = 0;
			channelIndex < numberOfChannels;
			channelIndex++
		) {
			channelGain[channelIndex] = new GainNode(audioContext);
			channelGain[channelIndex].connect(channelSplitter);
		}
	},
	loadSamples(samplePaths) {
		if (samplePaths && samplePaths.length) {
			const { path } = samplePaths[0];
			return readToAudioBuffer(path)
				.then(buffer => {
					buffers.set(path, buffer);
				})
				.then(() => this.loadSamples(samplePaths.slice(1)));
		}
		return Promise.resolve();
	},
	playSample(samplePath, channelNumber) {
		const sample = buffers.get(samplePath);
		if (!(sample && sample.length)) {
			console.warn('sample not loaded', samplePath);
			return;
		}
		const bufferPlabackNode = new AudioBufferSourceNode(audioContext, {
			buffer: sample
		});

		bufferPlabackNode.connect(channelGain[channelNumber]);

		bufferPlabackNode.start();
	},
	setChannelGain(gain, channelNumber) {
		channelGain[channelNumber].gain.setTargetAtTime(
			gain,
			audioContext.currentTime,
			0.1
		);
	}
};

import { readFile } from 'fs';
import { promisify } from 'util';
import decode from 'audio-decode';
import 'flac.js';
import 'mp3.js';
import 'opus.js';
import 'vorbis.js';

let buffers = new Map();
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
	loadSamples(samplePaths) {
		if (samplePaths && samplePaths.length) {
			const { path, name } = samplePaths[0];
			return readToAudioBuffer(path)
				.then(buffer => {
					buffers.set(name, buffer);
				})
				.then(() => this.loadSamples(samplePaths.slice(1)));
		}
		return Promise.resolve();
	},
	playSample(sampleName) {
		const sample = buffers.get(sampleName);
		if (!(sample && sample.length)) {
			console.warn('sample not loaded', sampleName);
			return;
		}
		const bufferPlabackNode = new AudioBufferSourceNode(audioContext, {
			buffer: sample
		});

		bufferPlabackNode.connect(channelSplitter);

		bufferPlabackNode.start();
	}
};

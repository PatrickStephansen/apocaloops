import { readFile } from 'fs';
import { promisify } from 'util';
import decode from 'audio-decode';
import 'flac.js';
import 'mp3.js';
import 'opus.js';
import 'vorbis.js';

let buffers = new Map();
let channels = [];
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

const crossFadeExponentialApproachConstant = 0.0005;
export const samplePlayer = {
	setupChannels(numberOfChannels) {
		for (
			let channelIndex = 0;
			channelIndex < numberOfChannels;
			channelIndex++
		) {
			channels[channelIndex] = {
				outputGain: new GainNode(audioContext),
				sampleOverlapMode: 'overlay',
				bufferGain: new GainNode(audioContext, { gain: 0 })
			};
			channels[channelIndex].outputGain.connect(channelSplitter);
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
		let bufferGain;
		if (channels[channelNumber].sampleOverlapMode === 'cross-fade') {
			channels[channelNumber].bufferGain.gain.setTargetAtTime(
				0,
				audioContext.currentTime,
				crossFadeExponentialApproachConstant
			);
			bufferGain = new GainNode(audioContext, { gain: 0 });
			channels[channelNumber].bufferGain = bufferGain;
		} else {
			bufferGain = channels[channelNumber].bufferGain;
		}
		bufferGain.gain.setTargetAtTime(1, audioContext.currentTime, crossFadeExponentialApproachConstant);
		bufferGain.gain.setTargetAtTime(0, bufferPlabackNode.buffer.duration, crossFadeExponentialApproachConstant);

		bufferPlabackNode.connect(bufferGain);
		bufferGain.connect(channels[channelNumber].outputGain);

		bufferPlabackNode.start();
	},
	setChannelGain(gain, channelNumber) {
		channels[channelNumber].outputGain.gain.setTargetAtTime(
			gain,
			audioContext.currentTime,
			crossFadeExponentialApproachConstant
		);
	},
	setChannelOverlapMode(channelNumber, modeId) {
		channels[channelNumber].sampleOverlapMode = modeId;
	}
};

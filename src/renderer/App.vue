<template>
	<div class="looper-app">
		<h1>Apocaloops</h1>
		<library-directory
			:libraryDirectory="libraryDirectory"
			@rescan="onLibraryDirectorySelection($event)"
		/>
		<div class="channels">
			<div
				class="channel-container"
				v-for="(channel, channelNumber) in channels"
				:key="channelNumber"
			>
				<h2>Channel {{ channelNumber + 1 }}</h2>
				<sampler-channel
					:channelNumber="channelNumber"
					:banks="banks"
					:selectedBankDirectory="
						selectedBankPerChannel.find(s => s.channelNumber === channelNumber)
					"
					:selectedSample="
						selectedSamplePerChannel.find(
							s => s.channelNumber === channelNumber
						)
					"
					:gain="channel.gain"
					:playbackRate="channel.playbackRate"
					:sampleOverlapBehaviourChoices="sampleOverlapBehaviourChoices"
					:selectedSampleOverlapBehaviourId="
						channel.selectedSampleOverlapBehaviourId
					"
					@overlap-behaviour-selected="
						onSampleOverlapBehaviourSelection({
							channelNumber,
							sampleOverlapBehaviourId: $event.behaviourId
						})
					"
					:sampleEndBehaviourChoices="sampleEndBehaviourChoices"
					:selectedSampleEndBehaviourId="channel.selectedSampleEndBehaviourId"
					@sample-end-behaviour-selected="
						onSampleEndBehaviourSelection({
							channelNumber,
							sampleEndBehaviourId: $event.behaviourId
						})
					"
					:samples="getSamplesForChannel(channelNumber)"
					@bank-selected="
						onBankSelection({ channelNumber, bankPath: $event.bankPath })
					"
					@sample-selected="
						onSampleSelection({ channelNumber, samplePath: $event.samplePath })
					"
					@set-gain="onSetGain({ channelNumber, gain: $event.gain })"
					@set-playback-rate="
						onSetPlaybackRate({
							channelNumber,
							playbackRate: $event.playbackRate
						})
					"
				/>
			</div>
		</div>
		<error-list :errors="errors" />
	</div>
</template>

<script>
import { homedir } from 'os';
import { join } from 'path';
import { mapActions, mapGetters, mapState } from 'vuex';

import SamplerChannel from './components/SamplerChannel';
import LibraryDirectory from './components/LibraryDirectory';
import ErrorList from './components/ErrorList';

export default {
	name: 'apocaloops',
	components: {
		SamplerChannel,
		LibraryDirectory,
		ErrorList
	},
	methods: {
		...mapActions({
			onLibraryDirectorySelection: 'setLibraryDirectory',
			onBankSelection: 'selectBank',
			onSampleSelection: 'selectSample',
			onSetGain: 'setChannelGain',
			onSetPlaybackRate: 'setChannelPlaybackRate',
			onSampleOverlapBehaviourSelection: 'selectSampleOverlapBehaviour',
			onSampleEndBehaviourSelection: 'selectSampleEndBehaviour'
		}),
		getSamplesForChannel(channelNumber) {
			const channel = this.samplesPerChannel.find(
				s => s.channelNumber === channelNumber
			);
			if (channel) {
				return channel.samples;
			}
			return [];
		}
	},
	computed: {
		...mapGetters([
			'banks',
			'selectedBankPerChannel',
			'samplesPerChannel',
			'selectedSamplePerChannel'
		]),
		...mapState({
			libraryDirectory: state => state.samples.libraryDirectory,
			channels: state => state.samples.channels,
			errors: state => state.samples.errors,
			sampleOverlapBehaviourChoices: state =>
				state.samples.sampleOverlapBehaviourChoices,
			sampleEndBehaviourChoices: state =>
				state.samples.sampleEndBehaviourChoices
		})
	},
	mounted: function() {
		this.onLibraryDirectorySelection({
			libraryDirectory: join(homedir(), '.apocaloops')
		});
	}
};
</script>

<style>
.channels {
	display: flex;
}
.channel-container {
	flex: 1 1 auto;
}
</style>

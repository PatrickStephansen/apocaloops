<template>
	<div class="channel">
		<gain-control :gain="gain" @set-gain="$listeners['set-gain']" />
		<playback-rate-control
			:playbackRate="playbackRate"
			@set-playback-rate="$listeners['set-playback-rate']"
		/>
		<sample-overlap
			:behaviourChoices="sampleOverlapBehaviourChoices"
			:selectedBehaviourId="selectedSampleOverlapBehaviourId"
			@overlap-behaviour-selected="$listeners['overlap-behaviour-selected']"
		/>
		<sample-end
			:behaviourChoices="sampleEndBehaviourChoices"
			:selectedBehaviourId="selectedSampleEndBehaviourId"
			@sample-end-behaviour-selected="
				$listeners['sample-end-behaviour-selected']
			"
		/>
		<bank-selector
			:selectedBankDirectory="selectedBankDirectory"
			:banks="banks"
			@bank-selected="$listeners['bank-selected']"
		/>
		<sample-list
			:selectedSampleFileName="selectedSample.sampleFileName"
			:samples="samples"
			v-on="$listeners"
		/>
	</div>
</template>

<script>
import BankSelector from './BankSelector';
import SampleList from './SampleList';
import GainControl from './GainControl';
import PlaybackRateControl from './PlaybackRateControl';
import SampleOverlap from './SampleOverlap';
import SampleEnd from './SampleEnd';

export default {
	name: 'sampler-channel',
	props: [
		'channelNumber',
		'banks',
		'selectedBankDirectory',
		'selectedSample',
		'samples',
		'gain',
		'playbackRate',
		'sampleOverlapBehaviourChoices',
		'sampleEndBehaviourChoices',
		'selectedSampleOverlapBehaviourId',
		'selectedSampleEndBehaviourId'
	],
	components: {
		BankSelector,
		SampleList,
		GainControl,
		PlaybackRateControl,
		SampleOverlap,
		SampleEnd
	}
};
</script>

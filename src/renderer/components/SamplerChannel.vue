<template>
	<div class="channel">
		<gain-control :gain="gain" @set-gain="$listeners['set-gain']"/>
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

export default {
	name: 'sampler-channel',
	props: [
		'channelNumber',
		'banks',
		'selectedBankDirectory',
		'selectedSample',
		'samples',
		'gain'
	],
	components: {
		BankSelector,
		SampleList,
		GainControl
	}
};
</script>

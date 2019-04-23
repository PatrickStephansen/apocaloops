<template>
	<div class="channel">
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

export default {
	name: 'sampler-channel',
	props: [
		'channelNumber',
		'banks',
		'selectedBankDirectory',
		'selectedSample',
		'samples'
	],
	components: {
		BankSelector,
		SampleList
	}
};
</script>

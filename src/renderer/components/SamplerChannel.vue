<template>
	<div class="channel">
		<bank-selector
			:selectedBankDirectory="selectedBankDirectory"
			:banks="banks"
		/>
		<sample-list
			:selectedSampleFileName="selectedSample.name"
			:samples="samples"
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

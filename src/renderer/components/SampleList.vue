<template>
	<div class="form-group">
		Samples
		<ul>
			<li
				v-for="(sample, index) in samples"
				:key="index"
				:class="{
					sample: true,
					active: selectedSampleFileName == sample.name
				}"
				@click="$emit('sample-selected', { samplePath: sample.path })"
			>
				{{ sample.name }}
			</li>
		</ul>
	</div>
</template>

<script>
export default {
	name: 'sample-list',
	props: ['selectedSampleFileName', 'samples'],
	data: function() {
		return { sampleSelectionControlVoltage: 0 };
	}
};
</script>

<style>
.sample.active {
	background-color: yellow;
}
</style>
<template>
	<div class="form-group">
		<label
			>Gain
			<input
				type="number"
				name="gain"
				min="0"
				max="1"
				step="0.05"
				:value="gain"
				@change="setGain($event.target.value)"
		/></label>
	</div>
</template>

<script>
import { clamp } from 'ramda';
export default {
	name: 'gain-control',
	props: ['gain'],
	methods: {
		setGain(gain) {
			if (!isNaN(gain)) {
				this.$emit('set-gain', { gain: clamp(0, 1, gain) });
			}
		}
	}
};
</script>

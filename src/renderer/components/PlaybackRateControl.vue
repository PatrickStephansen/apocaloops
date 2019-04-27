<template>
	<div class="form-group">
		<label
			>Playback Rate
			<input
				type="number"
				name="playbackRate"
				min="0"
				max="8"
				step="0.05"
				:value="playbackRate"
				@input="setPlaybackRate($event.target.value)"
		/></label>
	</div>
</template>

<script>
import { clamp } from 'ramda';
export default {
	name: 'playback-rate-control',
	props: ['playbackRate'],
	methods: {
		setPlaybackRate(playbackRate) {
			if (!isNaN(playbackRate)) {
				this.$emit('set-playback-rate', { playbackRate: clamp(0, 8, playbackRate) });
			}
		}
	}
};
</script>

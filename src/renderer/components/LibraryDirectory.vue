<template>
	<div class="form-group">
		<label for="library-directory">Library Directory</label>
		<p id="library-directory">{{ libraryDirectory }}</p>
		<button type="button" @click="$emit('rescan', { libraryDirectory })">
			Rescan
		</button>
	</div>
</template>

<script>
export default {
	name: 'library-directory',
	props: ['libraryDirectory']
};
</script>


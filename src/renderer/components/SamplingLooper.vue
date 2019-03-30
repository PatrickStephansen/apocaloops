<template>
	<div class="looper-app">
		<h1>Apocaloops</h1>
		<folder-selector />
	</div>
</template>

<script>
import FolderSelector from './FolderSelector';
export default {
	name: 'looper',
	components: { FolderSelector }
};
</script>

<template>
	<div v-if="errors.length">
		Errors:
		<ul>
			<li v-for="error in errors" class="danger" :key="error">{{ error }}</li>
		</ul>
	</div>
</template>
<script>
export default {
	name: 'error-list',
	props: ['errors']
};
</script>
<style>
.danger {
	color: red;
}
</style>

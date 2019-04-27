<template>
	<div class="sample-end">
		<label>Sample end behaviour</label>
		<select
			name="sample-end-behaviour"
			:value="selectedBehaviourId"
			@change="
				$emit('sample-end-behaviour-selected', {
					behaviourId: $event.target.value
				})
			"
		>
			<option
				v-for="choice in behaviourChoices"
				:key="choice.id"
				:value="choice.id"
				>{{ choice.name }}</option
			>
		</select>
	</div>
</template>
<script>
export default {
	name: 'sample-end',
	props: ['behaviourChoices', 'selectedBehaviourId']
};
</script>

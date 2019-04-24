<template>
	<div class="sample-overlap">
		<label>Sample overlap behaviour</label>
		<select
			name="sample-overlap-behaviour"
			:value="selectedBehaviourId"
			@change="
				$emit('overlap-behaviour-selected', {
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
	name: 'sample-overlap',
	props: ['behaviourChoices', 'selectedBehaviourId']
};
</script>

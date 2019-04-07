<template>
	<div class="bank-selector">
		<div class="form-group">
			<label for="selected-bank">Selected Bank</label>
			<select
				name="selected-bank"
				id="selected-bank"
				:value="selectedBankDirectory.path"
				@change="$emit('bank-selected', { bankPath: $event.target.value })"
			>
				<option v-for="bank in banks" :value="bank.path" :key="bank.path"
					>{{ bank.name }}
				</option>
			</select>
		</div>
	</div>
</template>

<script>
import SampleList from './SampleList';

export default {
	name: 'bank-selector',
	props: ['selectedBankDirectory', 'banks'],
	components: { SampleList }
};
</script>



<template>
	<div class="bank-selector">
		<div class="form-group">
			<label
				>Selected Bank
				<select
					name="selected-bank"
					:value="selectedBankDirectory.path"
					@change="$emit('bank-selected', { bankPath: $event.target.value })"
				>
					<option v-for="bank in banks" :value="bank.path" :key="bank.path"
						>{{ bank.name }}
					</option>
				</select>
			</label>
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



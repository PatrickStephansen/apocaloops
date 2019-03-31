<template>
	<form name="folder-selection">
		<div class="form-group">
			<label for="library-directory">Library Directory</label>
			<input
				type="text"
				name="library-directory"
				id="library-directory"
				:value="libraryDirectory"
				@blur="
					onLibraryDirectorySelection({ libraryDirectory: $event.target.value })
				"
			/>
		</div>
		<div class="form-group">
			<label for="selected-bank">Selected Bank</label>
			<select
				name="selected-bank"
				id="selected-bank"
				:value="selectedBankDirectory"
				@change="onBankSelection({ bankPath: $event.target.value })"
			>
				<option v-for="bank of banks" :value="bank.path" :key="bank.path"
					>{{ bank.name }}
				</option>
			</select>
		</div>
		<div class="form-group">
			Samples
			<ul>
				<li
					v-for="sample of samples"
					:key="sample.path"
					:class="{
						sample: true,
						active: selectedSampleFileName == sample.name
					}"
					@click="onSampleSelection({ samplePath: sample.path })"
				>
					{{ sample.name }}
				</li>
			</ul>
		</div>
	</form>
</template>

<script>
import { join } from 'path';
import { homedir } from 'os';
import { mapActions, mapGetters, mapState } from 'vuex';

export default {
	name: 'folder-selector',
	mounted: function() {
		this.onLibraryDirectorySelection({
			libraryDirectory: join(homedir(), '.apocaloops')
		});
	},
	methods: {
		...mapActions({
			onLibraryDirectorySelection: 'setLibraryDirectory',
			onBankSelection: 'selectBank',
			onSampleSelection: 'selectSample'
		})
	},
	computed: {
		...mapState(['libraryDirectory', 'selectedBankDirectory']),
		...mapGetters(['selectedSampleFileName', 'banks', 'samples'])
	}
};
</script>

<style>
.sample.active {
	background-color: yellow;
}
</style>



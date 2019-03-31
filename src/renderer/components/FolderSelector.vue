<template>
	<form name="folder-selection">
		<div class="form-group">
			<label for="banks-directory">Banks Directory</label>
			<input
				type="text"
				name="banks-directory"
				id="banks-directory"
				:value="banksDirectory"
				@blur="onBanksDirectorySelection($event.target.value)"
			/>
		</div>
		<div class="form-group">
			<label for="selected-bank">Selected Bank</label>
			<select
				name="selected-bank"
				id="selected-bank"
				v-model="selectedBank"
				@change="onBankSelection($event.target.value)"
			>
				<option v-for="bank of banks" :value="getBankPath(bank)" :key="bank"
					>{{ bank }}
				</option>
			</select>
		</div>
		<div class="form-group">
			Samples
			<ul>
				<li
					v-for="sample of samples"
					:key="sample"
					:class="{ sample: true, active: selectedSampleFileName == sample }"
				>
					{{ sample }}
				</li>
			</ul>
		</div>
	</form>
</template>

<script>
import { promisify } from 'util';
import { access, mkdir, readdir } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

const exists = promisify(access);
const readdirPromise = promisify(readdir);
const readDir = path => readdirPromise(path);

export default {
	name: 'folder-selector',
	data: function() {
		return {
			banksDirectory: '',
			selectedBank: '',
			banks: [],
			selectedSample: '',
			samples: []
		};
	},
	mounted: function() {
		this.onBanksDirectorySelection(join(homedir(), '.apocaloops'));
	},
	methods: {
		onBanksDirectorySelection: function(newBanksDirectory) {
			if (newBanksDirectory === this.banksDirectory) return;
			this.banksDirectory = newBanksDirectory;
			return exists(this.banksDirectory)
				.catch(() => mkdir(this.banksDirectory))
				.then(() => readDir(this.banksDirectory))
				.then(banks => {
					this.banks = banks;
					return this.onBankSelection(this.getBankPath(banks[0]));
				});
		},
		onBankSelection: function(newBank) {
			this.selectedBank = newBank;
			return readDir(newBank)
				.then(samples => {
					this.samples = samples;
					this.selectedSample = join(newBank, samples[0]);
				})
				.catch(e => console.error('error setting banks', e));
		},
		getBankPath: function(bank) {
			return join(this.banksDirectory, bank);
		}
	},
	computed: {
		selectedSampleFileName: function() {
			return this.selectedSample.slice(this.selectedBank.length + 1);
		}
	}
};
</script>

<style>
.sample.active {
	background-color: yellow;
}
</style>



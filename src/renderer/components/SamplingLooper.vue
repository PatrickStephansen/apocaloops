<template>
	<h1>Apocaloops</h1>
</template>

<script>
const context = new AudioContext();
const o = new OscillatorNode(context);
o.connect(context.destination);
o.start();

export default {
	name: 'looper'
};
</script>

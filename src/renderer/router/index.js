import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
	routes: [
		{
			path: '/',
			name: 'sampling-looper',
			component: require('@/components/SamplingLooper').default
		},
		{
			path: '*',
			redirect: '/'
		}
	]
});

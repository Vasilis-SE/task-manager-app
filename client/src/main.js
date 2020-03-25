const cors = require("cors");

import Vue from 'vue';
import App from './App.vue';
import Login from './views/Login.vue';

import router from './router';
import vuetify from './plugins/vuetify.js';
import './registerServiceWorker';

Vue.config.productionTip = false;

console.log(router.history.current)

new Vue({
	router,
	vuetify,
	render: (h) => h(App),
}).$mount('#app');

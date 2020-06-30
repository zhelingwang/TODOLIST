import Vue from 'vue';
import App from './App.vue';
// 引入 ViewUI
import 'view-design/dist/styles/iview.css';
import store from './store/index.js';
import tools from './tools';

new Vue({
    store,
    render: h => h(App),
}).$mount('#app')

tools.registerSW();








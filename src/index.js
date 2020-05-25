import Vue from 'vue';
import App from './App.vue'
// 引入 ViewUI
// import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';

new Vue({
    render: h => h(App),
}).$mount('#app')


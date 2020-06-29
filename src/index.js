import Vue from 'vue';
import App from './App.vue';
// 引入 ViewUI
import 'view-design/dist/styles/iview.css';
import store from './store/index.js';
new Vue({
    store,
    render: h => h(App),
}).$mount('#app')

// register sw
// if you don't need your PWA to work offline , just set up an empty /registerServiceWorker.js
// local test should open with 'https' prefixer or 'localhost' in url , or navigator is undefined
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(function (registration) {
            console.log("Service Worker Registered", registration);
            // subscribe(registration);
        }).catch(function (err) {
            console.log("Service Worker Failed to Register", err);
        });
} else {
    console.warn('do not support sw');
}






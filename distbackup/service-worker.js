const cacheName = "myPWACache";
const appShellFiles = [
    '/imgs/64-64.ico',
    '/imgs/192x192.png',
    '/imgs/512x512.png',
    '/index.bundle.js'
];

const contentToCache = appShellFiles.concat([]);

self.addEventListener('install', function (e) {
    // 执行完waitUtil再安装
    console.log('------before Service Worker install------');
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log(`cache opened and caching , \n  cache name is ${cacheName} , \n  cache collection is ${caches} , \n  cache content is ${contentToCache}`);
            return cache.addAll(contentToCache);
        }).catch(e => {
            console.warn('some resources request failed', e);
        })
    );
    console.log('------Service Worker installed------');
});

// 拦截请求 , 决定响应的内容
self.addEventListener('fetch', function (e) {
    e.repondWith(
        caches.match(e.request).then(function (r) {
            console.log('[Service Worker] Fetching resource: ' + e.request.url);
            console.log(`e.requesr obj is `, e.request);
            return r || fetch(e.request).then(function (response) {
                return caches.open(cacheName).then(function (cache) {
                    console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
                    cache.put(e.request, response.clone());
                    return response;
                });
            })
        })
    );
})
const host = 'http://127.0.0.1:3005';
function getEndpoint() {
    return self.registration.pushManager.getSubscription()
        .then(function (subscription) {
            if (subscription) {
                return subscription.endpoint;
            }
            throw new Error('User not subscribed');
        });
}
self.addEventListener('push', function (event) {
    console.log('ServiceWorker : received push event message');
    // 接收的不同消息需要不同的tag , 否则 showNotification 只有效一次
    const tag = "TODOList-PWA-sample" + Math.random();
    event.waitUntil(
        getEndpoint()
            .then(function (endpoint) {
                return fetch(host + '/getPayload?endpoint=' + endpoint);
            })
            .then(function (response) {
                return response.text();
            })
            .then(function (payload) {
                payload = JSON.parse(payload);
                let icon = "/imgs/default.jpeg";
                switch (payload.type) {
                    case 'ADD':
                        icon = "/imgs/add.png";
                        break;
                    case 'REMOVE':
                        icon = "/imgs/remove.png";
                        break;
                    case 'FINISHED':
                        icon = "/imgs/finish.png";
                        break;
                    case 'CLEARALL':
                        icon = "/imgs/clear.png";
                        break;
                    default:
                        break;
                }
                console.log(payload, "??++");
                self.registration.showNotification('Zheling Cookbook', {
                    body: payload.text,
                    icon,
                    tag
                });
            })
    );
});
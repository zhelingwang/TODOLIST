// 缓存和更新 , 立即从缓存中响应资源 , 接着在发起请求以更新缓存
// 场景 : 使用与不介意暂时与服务器不同步的资源

self.addEventListener('fetch', function (evt) {
    // answer immediately
    evt.respondWith(fromCache(evt.request));
    // prevent the worker from being killed until the cache is updated
    evt.waitUntil(update(evt.request));
})

function update(request) {
    return caches.open(cacheName).then(function (cache) {
        return fetch(request).then(response => {
            return cache.put(request, response.clone());
        });
    });
}
// 总是从缓存中返回内容
// 场景 : 适用于特定版本的站点中某些内容不会发生变化的资源 , 如: appShellFiles
const cacheName = 'networkOrCache';

self.addEventListener('fetch', function (evt) {
    evt.respondWith(fromCache(evt.request));
});

function fromCache(request) {
    return caches.open(cacheName).then(function (cache) {
        return cache.match(request).then(function (matching) {
            return matching || Promise.reject('no-match');
        })
    });
}

// 1.network or cache : 获取最新内容,若网络负载过重,则使用缓存来响应
// 场景 : 需快速显示最新内容的
// 若网络返回超出超时时间timeout,则后退使用缓存数据作为返回内容
const cacheName = 'networkOrCache';

self.addEventListener('fetch', function (evt) {
    evt.respondWith(fromNetwork(evt.request, 500).catch(function () {
        return fromCache(evt.request);
    }));
});

function fromNetwork(request, timeout) {
    return new Promise(function (resolve, reject) {
        let timeoutId = setTimeout(reject, timeout);
        fetch(reject).then(response => {
            clearTimeout(timeoutId);
            resolve(response);
        }, reject)
    });
}

function fromCache(request) {
    return caches.open(cacheName).then(function (cache) {
        return cache.match(request).then(function (matching) { // 匹配结果 : 有匹配的资源或者没有响应的资源
            return matching || Promise.reject('no-match');
        })
    });
}
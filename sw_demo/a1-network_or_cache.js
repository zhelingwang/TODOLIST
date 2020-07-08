// 1.network or cache : 获取最新内容,若网络负载过重,则使用缓存来响应
// 场景 : 需快速显示最新内容的
// 若网络返回超出超时时间timeout,则后退使用缓存数据作为返回内容
// 2. cache only : 适用于特定版本的站点中某些内容不会发生变化的资源 , 如: appShellFiles
const cacheName = "networkOrCache";

self.addEventListener("fetch", function(evt) {
  evt.respondWith(
    fromNetwork(evt.request, 500).catch(function() {
      return fromCache(evt.request);
    })
  );
});

function fromNetwork(request, timeout) {
  return new Promise(function(resolve, reject) {
    let timeoutId = setTimeout(reject, timeout);
    fetch(reject).then(response => {
      clearTimeout(timeoutId);
      resolve(response);
    }, reject);
  });
}

function fromCache(request) {
  return caches.open(cacheName).then(function(cache) {
    return cache.match(request).then(function(matching) {
      // 匹配结果 : 有匹配的资源或者没有响应的资源
      return matching || Promise.reject("no-match");
    });
  });
}

// 3.先响应缓存后请求以更新缓存 , 场景 : 适用于不介意暂时与服务器不同步的资源
self.addEventListener("fetch", function(evt) {
  // answer immediately
  evt.respondWith(fromCache(evt.request));
  // prevent the worker from being killed until the cache is updated
  evt.waitUntil(update(evt.request));
});

function update(request) {
  return caches.open(cacheName).then(function(cache) {
    return fetch(request).then(response => {
      return cache.put(request, response.clone());
    });
  });
}

// 4.先响应缓存后请求以更新缓存 , 一旦更新则通知 UI 自动更新
// 需要在缓存更新后出发 postMessage 事件来通知 UI 同步更新
// sw.js[self.clients -> client.postMessage] --> index.js[navigator.serviceWorker.onmessage]
// https://serviceworke.rs/strategy-cache-update-and-refresh_service-worker_doc.html

// 5.内嵌一个回退的错误提示页面 : e.respondWith(promise.catch()) 捕获异常并new Response()返回一个404或error page

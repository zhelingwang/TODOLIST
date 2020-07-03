// self.importScripts('./config.js');
const host = "http://127.0.0.1:3005";
const cacheName = "myPWACache";
//更好的方式是作为一个json文件放在服务端 , 通过请求这个json文件来获取文件清单
const appShellFiles = [
  "/imgs/64-64.ico",
  "/imgs/192x192.png",
  "/imgs/512x512.png",
  "/index.js",
  "/offline.html"
];

const contentToCache = appShellFiles.concat([]);

self.addEventListener("install", function(e) {
  e.waitUntil(
    caches
      .open(cacheName)
      .then(function(cache) {
        // console.log(`cache opened and caching , \n  cache name is ${cacheName} , \n  cache collection is ${caches} , \n  cache content is ${contentToCache}`);
        return cache.addAll(contentToCache);
      })
      .then(function() {
        console.log(
          "[install] All required resources have been cached, " + "we're good!"
        );
        return self.skipWaiting();
      })
      .catch(e => {
        console.warn("some resources request failed", e);
      })
  );
});

// 拦截请求 , 决定响应的内容
self.addEventListener("fetch", function(e) {
  // console.log('fetching...', e);
  if (e.request.method === "GET") {
    e.respondWith(
      caches.match(e.request).then(function(r) {
        // console.log('[Service Worker] Fetching resource: ' + e.request.url);
        return (
          r ||
          fetch(e.request)
            .then(function(response) {
              if (!response.ok) {
                throw new Error("no such resource!");
              }
              return caches.open(cacheName).then(function(cache) {
                console.warn(
                  `[Service Worker] Caching new resource: ${e.request.url}`
                );
                cache.put(e.request, response.clone());
                return response;
              });
            })
            .catch(err => {
              return caches.open(cacheName).then(function(cache) {
                return cache.match("/offline.html");
              });
            })
        );
      })
    );
  }
  if (e.request.method === "POST") {
    console.log("post");
  }
});

self.addEventListener("activate", function(event) {
  event.waitUntil(self.clients.claim()); // take controll
});

function getEndpoint() {
  return self.registration.pushManager
    .getSubscription()
    .then(function(subscription) {
      if (subscription) {
        return subscription.endpoint;
      }
      throw new Error("User not subscribed");
    });
}

self.addEventListener("push", function(event) {
  // 获取 payload 的方式一 :
  // const payload = event.data ? event.data.text() : 'no payload';
  // 此处 payload 来自 webPush.sendNotification(subscription, payload, options)
  // console.log('ServiceWorker : received push event message : ', event.data.text());
  // tag作用 : 通知ID , 让你使用新通知代替旧通知或者将多个通知折叠成一个
  // 接收的不同消息需要不同的tag , 否则下一个相同tag的通知会替换旧通知(由于旧通知已经弹出过了,故复用该通知只会替换通知内容而不会再有重新弹出的动作)
  const tag = "TODOList-PWA-sample" + Math.random();
  // 获取 payload 的方式二 : 通过 subscription 的 endpoint 来重发请求
  // 通知可以在caches中自定义一个cache来保存 , 再通过 caches.open('notifications') 获取
  event.waitUntil(
    getEndpoint()
      .then(function(endpoint) {
        return fetch(host + "/getPayload?endpoint=" + endpoint);
      })
      .then(function(response) {
        return response.text();
      })
      .then(function(payload) {
        payload = JSON.parse(payload);
        const icon = switchIcon(payload);
        self.registration.showNotification("TODO tips", {
          body: payload.text,
          icon,
          tag
        });
        // more others options : https://notifications.spec.whatwg.org/ or MDN
      })
  );
});

function switchIcon(payload) {
  let icon = "/imgs/default.jpeg";
  switch (payload.type) {
    case "ADD":
      icon = "/imgs/add.png";
      break;
    case "REMOVE":
      icon = "/imgs/remove.png";
      break;
    case "FINISHED":
      icon = "/imgs/finish.png";
      break;
    case "CLEARALL":
      icon = "/imgs/clear.png";
      break;
    case "offline":
    default:
      break;
  }
  return icon;
}

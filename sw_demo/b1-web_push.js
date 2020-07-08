// entire process of web push : 订阅模式

// 1.从Server获取vapidPublicKey并配合使用 PushManager.subcribe() 来订阅推送消息 , 获得一个订阅者 subscription
// 2.server 取得 subscription 对象对应的终端 endpoint 并生成一个客户公钥

// client.js 发起一个 /sendNotification 的请求将subscription以及payload,ttl,delay等传递给服务器
// Server.js 保存该subscription的payload数据到Server的某个内存变量payloads中并调用 webPush.sendNotification()
// 触发 serviceWorker 中的 push 事件 , 再通过 subscription 对应的 endpoint 来获取payload 并调用 registration 的 showNotification

// 一订阅subscription
// 二Server通过subscription调用sendNotification
// 三serviceWorker通过push来showNotification

// 配合判断当前焦点是否在当前页面
self.addEventListener("activate", function(event) {
  // console.log('sw actived', event);
  // 允许一个激活的 service worker 将自己设置为其scope 内所有 clients 的 controller
  // https://serviceworke.rs/push-clients_service-worker_doc.html
  event.waitUntil(self.clients.claim);
});

self.addEventListener("push", function(event) {
  event.waitUntil(
    self.clients.matchAll().then(function(clientList) {
      var focused = clientList.some(function(client) {
        return client.focused;
      });
      var notificationMessage;
      if (focused) {
        notificationMessage = "You're still here, thanks!";
      } else if (clientList.length > 0) {
        notificationMessage =
          "You haven't closed the page, " + "click here to focus it!";
      } else {
        notificationMessage =
          "You have closed the page, " + "click here to re-open it!";
      }
      return self.registration.showNotification("ServiceWorker Cookbook", {
        body: notificationMessage
      });
    })
  );
});

self.addEventListener("notificationclick", function(event) {
  console.log("notification clicked !!!");
  event.waitUntil(
    self.clients.matchAll().then(function(clientList) {
      console.log(clientList, "++++");
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return self.clients.openWindow("/index.html");
    })
  );
});

// other events , when subscription expires,  pushsubcriptionchange will be fired
self.addEventListener("pushsubcriptionchange", function(event) {
  event.waitUntil();
});

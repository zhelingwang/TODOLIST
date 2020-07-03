# 一. Claim

让 serviceWorker 立即获取页面的控制权而不再需要通过 navigator event 来工作 , 即 sw 在安装完成后即可使用

# 二. Message Relay , 消息转发

- 1.index.js 中 ,
  - 作为 client 监听 message 事件(接收来自 sw.js 派发的 postMessage 事件);
  - navigation.serviceWorker.controller 派发 postMessage 事件
- 2.sw.js 中 ,
  - activate 事件中让 sw 能控制其作用域的所有 clients, event.waitUntil(self.clients.claim());
  - self 监听 message 事件接收来自 index.js 中 navigation.serviceWorker.controller 派发的 postMessage 事件
  - 然后遍历 self.clients , 向其他 client 逐个广播(即派发一个 postMessage 事件)收到的消息内容即可

> index.js --> navigation.serviceWorker.controller --> self.addEventListener('message',...) --> sw.js

# 三. fetching remote resources

两种标准方式加载远程资源(cors / no-cors) , 一种使用 sw 作为代理中间件的方式

serviceworker 必须在注册完成后再加载页面 , 这样才能保证 sw 取得了对页面的控制
可以在注册 sw 后重加载页面 , window.location.reload()

# 四.sw workflow and flowchart

sw 注册过程:

1. installing stage : 标志 registration 开始, 常用于初始化缓存以及添加离线应用时所需的文件
   - 对应 install 事件
     - 使用 event.waitUntil(promise)来扩展 installing stage 直到该 promise resolved
     - 使用 event.skipWaiting() , 可在激活前任何时间且无需等待当前受控 clients 的关闭就跳过 installed stage 直接进入 activating stage
2. installed stage : sw 安装完成并等待使用其它 sw 的 clients 关闭
3. activating stage : 没有 clients 受控于其它的 sw,该 stage 常用于允许 sw 安装完成或清除其它 sw 相关联的资源,如移除旧缓存
   - 对应 activate 事件
     - 使用 event.waitUntil(promise)来扩展 activating stage 直到该 promise resolved
     - 使用 self.clients.claim()在无需 reload clients 的前提下开始获取所有 open clients 的控制
       - clients 指的是当前应用活动的页面
4. activated stage : sw 现在可以处理功能事件了
5. redundant stage : sw 被其它 sw 所替代

> install --> activate --> redundant
> 三个阶段 , 两个事件(install , activate)

# 五.APIs

```js
/*
index.js
navigator.serviceWorker --> registration --> subscription
*/
// get registration
navigator.serviceWorker
  .register("sw.js", { scope: "/" })
  .then(registration => {});
navigator.serviceWorker.oncontrollerchange = function() {};
navigator.serviceWorker.ready.then(function(registration) {});
navigator.serviceWorker.getRegistration().then(registration => {});
// unregister via registration
registration.unregister().then();

// get subscription via registration
registration.pushManager.getSubscription().then(subscription => {});
registration.pushManager.subscribe({}).then(subscription => {});
subscription.endpoint;

// there was an active sw , no need to register
navigator.serviceWorker.controller;
navigator.serviceWorker.controller.onstatechange = function() {};

/*
serviceWorker.js
self --> install --> activate --> fetch
     --> push
*/
self.registration.pushManager.getSubscription().then(subscription => {});
self.registration.showNotification(title, options);

webPush.sendNotification(subscription, payload, options);
self.onpush = function(payload) {};
```

```text
 - self obj in sw.js : ServiceWorkerGlobalScope sw的顶层对象,类似于 window obj in index.js

 - ServiceWorker obj in self: 主要成员 , onerror,onstatechange,scriptURL,state

 - ServiceWorkerRegistration obj in self: active 属性指向 ServiceWorker , pushManager

 - navigator.serviceWorker[ServiceWorkerContainer] in index.js : controller,oncontrollerchagne,onmessage
    - controller : ServiceWorker obj
 - ServiceWorkerRegistration in index.js
```

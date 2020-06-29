// a3 升级版 : 先立即返回缓存资源 , 接着在后台请求新资源 , 最后一旦新资源返回就以某种方式展示最新的资源
// serviceWorker.js => client.postMessage()
// index.js => navigator.serviceWorker.onmessage

// entire process of web push : 订阅模式

// 1.从Server获取vapidPublicKey并配合使用 PushManager.subcribe() 来订阅推送消息 , 获得一个订阅者 subscription
// 2.server 取得 subscription 对象对应的终端 endpoint 并生成一个客户公钥

// client.js 发起一个 /sendNotification 的请求将subscription以及payload,ttl,delay等传递给服务器
// Server.js 保存该subscription的payload数据到Server的某个内存变量payloads中并调用 webPush.sendNotification()
// 触发 serviceWorker 中的 push 事件 , 再通过 subscription 对应的 endpoint 来获取payload 并调用 registration 的 showNotification

// 一订阅subscription 二Server通过subscription调用sendNotification 三serviceWorker通过push来showNotification

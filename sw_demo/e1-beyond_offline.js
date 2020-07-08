// 1. local download
self.addEventListener("fetch", function(event) {
  if (event.request.url.indexOf("download-file") !== -1) {
    event.respondWith(
      event.request.formData().then(function(formdata) {
        var filename = formdata.get("filename");
        var body = formdata.get("filebody");
        var response = new Response(body);
        response.headers.append(
          "Content-Disposition",
          'attachment; filename="' + filename + '"'
        );
        return response;
      })
    );
  }
});

// 2.sw can act like a remote server : 可用于解耦 UI 和 业务逻辑
//  https://github.com/fxos-components/serviceworkerware : 快速创建类似express的路由处理的虚拟服务器
importScripts("./ServiceWorkerWare.js");
const worker = new ServiceWorkerWare();
worker.get(root + "api/quotations", function(req, res) {
  // .....
  return new Response();
});
worker.init();

// 3.API Analytics : 可以添加数据埋点和API的调用次数等信息

// 4.load balanced : sw拦截对于某些的请求,基于服务器的可用性来选择最佳的响应服务器 , 类似负载均衡

// 5.cache from zip : 请求压缩包过来再解压后获取需要缓存的文件列表加入缓存 , 类似 cache json 文件

// 6.dependencies injection : act as a dependendcy injector , 避免硬编码
// 提供两个sw,一个为production,一个为testing,
// 让框架来决定应当注册哪一个sw

// 7.request deferrer : 离线状态下处理请求
// 离线状态下,将请求按顺序记录在一个队列中,先返回一个虚假的响应(statusCode : 202)
// 待重新联网时,根据队列中的请求重播所有的请求事务以同步到服务器

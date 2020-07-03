import config from "./config";
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default {
  setupPreSW() {
    const _this = this;
    navigator.serviceWorker.addEventListener("controllerchange", function(e) {
      //console.log('controller changed : ', e);
      navigator.serviceWorker.controller.addEventListener(
        "statechange",
        function() {
          //console.log('[controllerchange][statechange] A "statechange" has occured: ', this.state);
          if (this.state === "activated") {
            _this.notifyServerSendNotification({
              text: "you are now safe to go offline",
              type: "offline"
            });
          }
        }
      );
    });
  },
  registerSW() {
    this.setupPreSW();
    // if you don't need your PWA to work offline , just set up an empty /registerServiceWorker.js
    // local test should open with 'https' prefixer or 'localhost' in url , or navigator is undefined
    if (navigator.serviceWorker) {
      if (navigator.serviceWorker.controller) {
        return console.log("there was an active sw, no need to register");
      }
      navigator.serviceWorker
        .register("/service-worker.js", { scope: "/" })
        .then(function(registration) {
          console.log("Service Worker Registered");
        })
        .catch(function(err) {
          console.warn("Service Worker Failed to Register", err);
        });
    } else {
      console.warn("do not support sw");
    }
  },
  unregisterSW() {
    navigator.serviceWorker.getRegistration().then(function(registration) {
      if (registration) {
        registration.unregister().then(
          function() {
            console.log("unregister success!");
          },
          function(err) {
            console.log("unregister failed : ", err);
          }
        );
      }
    });
  },
  subscribe(callback) {
    // navigator.serviceWorker.getRegistration().then(function (registration) { })
    return navigator.serviceWorker.ready.then(function(register) {
      // 还可以在订阅前对用户是否授予了通知弹出的权限进行验证
      // console.log('register ---- ', register);
      Notification.requestPermission(function(status) {
        // console.log('Notification permission status : ', status); // granted or denied
        if (status === "denied") return;
        return register.pushManager
          .getSubscription()
          .then(async function(subscription) {
            // already exist
            if (subscription) return subscription;
            // 1.get server's public key
            const response = await fetch(config.HOST + "/vapidPublicKey");
            const vapidPublicKey = await response.text();
            const convertVapidKey = urlBase64ToUint8Array(vapidPublicKey);
            return register.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: convertVapidKey
            });
          })
          .then(function(subscription) {
            callback(subscription);
            // 服务端保存subscription
            // return fetch('register', {
            //     method: 'post',
            //     headers: {
            //         'Content-type': 'application/json'
            //     },
            //     body: JSON.stringify({
            //         endpoint: subscription.endpoint
            //     })
            // });
          });
      });
    });
  },
  unsubscribe() {
    navigator.serviceWorker.ready
      .then(function(registration) {
        return registration.pushManager.getSubscription();
      })
      .then(function(subscription) {
        subscription.unsubscribe().then(function() {
          console.log("Unsubscribed", subscription.endpoint);
          // 若服务器端在订阅时保存了subscription , 则需要订阅响应的接口移除subscription
          // ...fetch('unregister',function(){})
        });
      });
  },
  notifyServerSendNotification(payload) {
    this.subscribe(function(subscription) {
      // console.log("current subscription : ", subscription, "---");
      fetch(config.HOST + "/sendNotification", {
        method: "post",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({
          subscription,
          payload: payload
        })
      });
    });
  }
};

import config from './config';
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export default {
    subscribe(callback) {
        return navigator.serviceWorker.ready.then(function (register) {
            return register.pushManager.getSubscription().then(async function (subscription) {
                // already exist
                if (subscription) return subscription;
                // 1.get server's public key 
                const response = await fetch(config.HOST + '/vapidPublicKey');
                const vapidPublicKey = await response.text();
                const convertVapidKey = urlBase64ToUint8Array(vapidPublicKey);
                return register.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: convertVapidKey
                });
            }).then(function (subscription) {
                callback(subscription);
            });
        });
    },
    notifyServerSendNotification(payload) {
        this.subscribe(function (subscription) {
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
        })
    }
}
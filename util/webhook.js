const axios = require('axios');
class WebhookRequest {
    constructor(url, method, data) {
        this.url = url;
        this.method = method;
        this.data = data;
    }
    send() {
        return new Promise((resolve, reject) => {
            axios({
                url: 'https://api.devax1t.xyz/webhooks',
                method: this.method,
                data: this.body,
                headers: {
                    'Authorization': 'Bearer ' + process.env.webhookToken
                },
            }).then(res => {
                resolve(res);
            }).catch(err => {
                reject(err);
            });
        });
    }
}
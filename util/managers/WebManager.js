const path = require('path');
const WebSocket = require('ws');
const SearchManager = require('./SearchManager');
class WebManager {}
class WebManager2 {
    constructor(client) {
        // Listen to events from now on (and setup express app)
        const wss = new WebSocket.Server({
            port: process.env.webPort,
        })
        new SearchManager().search(path.join(__dirname, 'web'), async event => {
            event = await require(event);
            console.log(event.event)
        })
    }
}
module.exports = WebManager;
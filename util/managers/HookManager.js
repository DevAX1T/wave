const SearchManager = require('./SearchManager');
const Automod = require('./../Automod')
class HookManager {
    constructor (client, registerIn) {
        (new SearchManager()).search(registerIn, async hook => {
            hook = await require(hook);
            let fn = (...args) => hook.try(...args, client);
            if (hook.once) {
                client.once(hook.event, fn);
            } else {
                client.on(hook.event, fn);
            }
        }, true);
        Automod.search(client);
    }
}
module.exports = HookManager;
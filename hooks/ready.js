const noblox = require('noblox.js');
module.exports = {
    event: 'ready',
    once: true,
    try: async function(client) {
        output('magenta', 'Discord', `Connected to Discord as ${client.user.tag}`);
        client.user.setPresence(settings.presence);
        // set global.botUptime to the current unix time in seconds
        global.botUptime = Math.floor(Date.now() / 1000);
        global.clientDomain = isWindows ? 'localhost' : 'https://devax1t.xyz';
        client.version = '1.0.3' + (isWindows ? '-dev' : ''); //Bot Version
        client.cache = {};
        // Connect to noblox.js
        noblox.setCookie(settings.cookie).then((user) => {
            output('green', 'Roblox', `Connected to Roblox as ${user.UserName} (${user.UserID})`)
        }).catch(() => {
            output('red', 'Roblox', 'Failed to connect to Roblox')
        })
    }
}
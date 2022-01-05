const noblox = require('noblox.js');
module.exports = {
    event: 'ready',
    once: true,
    // external: true, // if true, the event will be called in external servers
    try: async function(client) {
        output('magenta', 'Discord', `Connected to Discord as ${client.user.tag}`);
        client.user.setPresence(settings.presence);
        // set global.botUptime to the current unix time in seconds
        global.botUptime = Math.floor(Date.now() / 1000);
        global.clientDomain = isWindows ? 'localhost' : 'https://devax1t.xyz';
        client.version = '1.0.0' + (isWindows ? '-dev' : ''); // BOTVERSION
        client.cache = {};
        // Connect to noblox.js
        const user = await noblox.setCookie(settings.cookie);
        if (user) {
            output('green', 'Roblox', `Connected to Roblox as ${user.UserName} (${user.UserID})`)
        } else {
            output('red', 'Roblox', 'Failed to connect to Roblox')
        }
    }
}
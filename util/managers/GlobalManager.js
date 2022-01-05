class GlobalManager {
    constructor(globals) {
        global.footer = 'Wave';
        global.kickedMembers = {};
        global.dformat = 'YYYY-MM-DD hh:mm A';
        global.lastCase = false;
        global.output = (color, subMessage, message) => {
        let ocolors = {
            red: '31',
            green: '32',
            yellow: '33',
            blue: '34',
            magenta: '35',
            cyan: '36',
            white: '37',
            bold: '1',
            underline: '4',
            background: '7',
            reset: '0'
        };
            // Colors:
        // Red: '\x1b[31m%s\x1b[0m'
        // Green: '\x1b[32m%s\x1b[0m'
        // Yellow: '\x1b[33m%s\x1b[0m'
        // Blue: '\x1b[34m%s\x1b[0m'
        // Magenta: '\x1b[35m%s\x1b[0m'
        // Cyan: '\x1b[36m%s\x1b[0m'
        // White: '\x1b[37m%s\x1b[0m'
        // Bold: '\x1b[1m%s\x1b[0m'
        // Underline: '\x1b[4m%s\x1b[0m'
        // Background: '\x1b[7m%s\x1b[0m'
        // Reset: '\x1b[0m'
            if (message) subMessage = `[${subMessage}] `;
            let path = `\x1b[${ocolors[color]}m${subMessage}\x1b[0m`+ (message || '');
            console.log(path);
        };
        // console.log('\x1b[32m%s\x1b[0m', 'hi');
        // console.log(`\x1b[35m[INFO]\x1b[0m ${client.user.tag} is ready!`);
        globals.forEach(async g => {
            g = await require(g);
            if (g.global) {
                for (let index in g.global) {
                    global[index] = g.global[index];
                };
            };
        });
    };
};
module.exports = GlobalManager;
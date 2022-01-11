class GlobalManager {
    constructor(globals) {
        global.footer = 'Wave';
        global.kickedMembers = {};
        global.dformat = 'YYYY-MM-DD hh:mm A';
        global.lastCase = false;
        global.hookValidate = (object, strict) => {
            return (strict ? object?.id : object.guild?.id) === settings.guild;
        }
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
            if (message) subMessage = `[${subMessage}] `;
            let path = `\x1b[${ocolors[color]}m${subMessage}\x1b[0m`+ (message || '');
            console.log(path);
        };
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
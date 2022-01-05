const {ArgumentType} = require('discord.js-commando');

class CaseArgumentType extends ArgumentType {
	constructor(client) {
		super(client, 'case');
	}
	async validate(val, msg, arg) {
        // returns {string | boolean} Returns either an error prompting the user to try again or success
        // code
        if (val.length === 36) {
            let hasDash = val.includes('-');
            if (hasDash) {
                let split = val.split('-');
                if (split.length === 5) {
                    return true;
                }
            }
        }
        if (val === 'last') {
            // get the case
            new Promise(async (resolve, reject) => {
                if (!lastCase) {
                    reject();
                    return;
                }
                resolve();
            }).then(() => {
                return true; 
            }).catch(() => {
                return false;
            });
        }
        return false;	
    }
	parse(val, msg) {
        if (val === 'last') return lastCase;
        return val
	}
}
module.exports = CaseArgumentType;

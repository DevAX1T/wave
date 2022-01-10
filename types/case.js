const {ArgumentType} = require('discord.js-commando');

class CaseArgumentType extends ArgumentType {
	constructor(client) {
		super(client, 'case');
	}
	async validate(val) {
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
        if (val.toLowerCase() === 'last' || val.toLowerCase() === 'recent') {
            // get the case
            if (lastCase) return true;
            return false;
        }
    }
	parse(val) {
        return (val.toLowerCase() === 'last' || val.toLowerCase() === 'recent') ? lastCase : val;
	}
}
module.exports = CaseArgumentType;

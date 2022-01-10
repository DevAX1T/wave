const {ArgumentType} = require('discord.js-commando');
const noblox = require('noblox.js');
let regex = /\d+/;
class RobloxUserArgumentType extends ArgumentType {
	constructor(client) {
		super(client, 'rbxuser');
	}
	async validate(val, msg) {
		let result;
		if (val.includes('#')) return null;
			let userId = parseInt(val);
			if (isNaN(userId)) {
				if (val.includes('roblox.com/users/')) {
					let matched = val.match(regex)
					if (!matched) return false;
					result = parseInt(matched[0]);
					if (isNaN(result)) return false;
				} else {
					result = await noblox.getIdFromUsername(val).catch(() => {
						return false;
					});
					if (result === false) return false;
				}
			} else result = userId;
		if (typeof result === 'string') return result;
		if (result) {
			msg.client.cache[msg.id] = result;
			setTimeout(() => {
				msg.client.cache[msg.id] = undefined;
			}, 3600 * 1000);
			return true;
		} else return false;
	}
	
	parse(val, msg) {
		return msg.client.cache[msg.id];
	}
}
module.exports = RobloxUserArgumentType;

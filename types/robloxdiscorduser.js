const {ArgumentType} = require('discord.js-commando');
const noblox = require('noblox.js');
/*
run(message, {user}) {
        if (user instanceof User) {
            message.reply(`Discord user ${user.tag} (${user.id})`)
        } else {
            message.reply(`Roblox user ${user}`)
        }

		*/
let regex = /\d+/;
// url.match(regex)[0] is the id
class RobloxDiscordUserArgumentType extends ArgumentType {
	constructor(client) {
		super(client, 'rbxdiscorduser');
	}
	async validate(val, msg, arg) {
		let result;
		if (val.includes('#')) return null;
		if (val.toLowerCase().includes('id-')) {
			let id = val.toLowerCase().split('id-')[1];
			let usertype = arg.type.types[1];
			if (usertype && usertype.id === 'user') {
				let isValidate = await usertype.validate(id, msg, arg);
				if (typeof isValidate === 'string') {
					return isValidate;
				}
				if (isValidate) {
					result = usertype.parse(id, msg);
				} else return false;
				// usertype.validate and parse if true ok
			}
		}
		if (!result) {
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
			} else {
				result = userId;
			}
		}

		if (typeof result === 'string') return result;
		if (result) {
			msg.client.cache[msg.id] = result; // userid
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
module.exports = RobloxDiscordUserArgumentType;

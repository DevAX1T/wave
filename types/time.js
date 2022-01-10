const {ArgumentType} = require('discord.js-commando');
const ms = require('ms');

class TimeArgumentType extends ArgumentType {
	constructor(client) {
		super(client, 'time');
	}
	async validate(val) {
		let time = ms(val) / 1000;
		let year2 = (86400 * (365*2)) // max time is 2 years
		return (time && (time < (year2)) && time > 1) || 'You provided an invalid time.'
	}
	
	parse(val) {
        return ms(val) / 1000;
	}
}
module.exports = TimeArgumentType;

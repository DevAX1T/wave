const {Command} = require('discord.js-commando');
const noblox = require('noblox.js');
const axios = require('axios');
const { MessageEmbed } = require('discord.js');

module.exports = class PossumCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'possum', // Lookup command - returns user accounts
            memberName: 'possum',
            description: 'Makes a user smile :D',
            group: 'mod',
            format: '<RobloxUser / DiscordId>',
            guildOnly: true,
            hidden: true,
            ownerOnly: true,
            args: [{
                key: 'user',
                prompt: 'Who would you like to make smile?',
                type: 'member',
            }]
        });
    }
    async run(message, args) {
        let accountAge = args.user.user.createdTimestamp * 1000;
        let daysNeeded = 30;
        // if account age is over 30 days, reply with 'a'
        let days = Math.floor(accountAge / (1000 * 60 * 60 * 24));
        console.log(days)
        if (days > daysNeeded) {
            message.channel.send('a');
        } else {
            message.channel.send('no')
        }
    }
}
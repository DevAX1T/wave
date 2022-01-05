const {Command} = require('discord.js-commando');
const {MessageEmbed} = require('discord.js');
const {oneLine, stripIndents} = require('common-tags');
const dayjs = require('dayjs');
module.exports = class ServerInfoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'serverinfo',
            memberName: 'serverinfo',
            description: 'Displays information about the server.',
            group: 'util',
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 10
            }
        });
    }
    run(message) {
        let embed = new MessageEmbed()
        .setColor(color.blue)
        .setAuthor(message.guild.name, message.guild.iconURL())
        .setThumbnail(message.guild.iconURL())
        .addField('Owner', message.guild.owner.user.tag, true)
        .addField('Category Channels', message.guild.channels.cache.filter(c => c.type === 'category').size, true)
        .addField('Text Channels', message.guild.channels.cache.filter(c => c.type === 'text').size, true)
        .addField('Voice Channels', message.guild.channels.cache.filter(c => c.type === 'voice').size, true)
        .addField('Members', message.guild.memberCount, true)
        .addField('Roles', message.guild.roles.cache.size, true)
        .setFooter(`${message.guild.id} | Created on `)
        .setTimestamp(message.guild.createdAt);
        message.channel.send(embed);          
    }
}
const {Command} = require('discord.js-commando');
const {MessageEmbed} = require('discord.js');
const {oneLine, stripIndents} = require('common-tags');
const dayjs = require('dayjs');
module.exports = class FilterCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'filter',
            memberName: 'filter',
            description: 'Reaction roles embed',
            group: 'util',
            ownerOnly: true,
            hidden: true,
        });
    }
    async run(message, args) {
        let embed = new MessageEmbed()
        .setColor(color.discordRed)
        .setTitle('Filter Triggered')
        .setDescription('`DevAX1T` (125196014) triggered filter word `fuck` on server `764e07c9-b5a4-4f3f-bcad-7352e82f7308`')
        .addField('Unfiltered Message', 'Man Idk what the fuck to do over here yknow like tf is going on loool')
        .addField('Filtered Message', 'Man Idk what the #### to do over here yknow like ## is going on')
        .addField('Chat Log created', 'Log `764e07c9-b5a4-4f3f-bcad-7352e82f7308`')
        .setFooter(footer)
        .setTimestamp();
        //let channel = message.guild.channels.cache.get(settings.channels.discord_logs);
        let msg = await message.channel.send(embed);
        msg.react('🔨');
        msg.react('⚠️');
        msg.react('❌');

    }
}
const { MessageEmbed } = require('discord.js');
const {Command} = require('discord.js-commando');
module.exports = class RuleembedCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ruleembed',
            group: 'util',
            memberName: 'ruleembed',
            description: 'rule embed lol',
            guildOnly: true,
            args: [],
            aliases: ['re']
        });
    }
    run(message, args) {
        let embed = new MessageEmbed()
        .setTitle('Server Rules')
        .setColor(color.blue)
        .setDescription('Everyone is expected to abide by these rules at all times. Breaking these rules will result in the appropriate punishment');
        settings.rules.forEach(rule => {
            embed.addField(`${rule.id}. ${rule.title}`, rule.rule);   
        });
        message.channel.send(embed);
        let embed2 = new MessageEmbed()
        .setTitle('Reporting a user')
        .setColor(color.blue)
        .setDescription(`To report a user, we usually prefer that you use our [report form](${settings.appealForm}). If needed, you can ping an individual moderator or the <@&${settings.roles.moderator}> role.`);
        message.channel.send(embed2);
    }
}
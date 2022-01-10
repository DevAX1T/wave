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
        .setDescription(`All members, including staff, are expected to abide by the following rules. Saying "I didn't know it was a rule" is not a valid reason for breaking such a rule. Failing to abide by these rules - intentionally or otherwise - will result in appropriate punishments.`);
        settings.rules.forEach(rule => {
            embed.addField(`${rule.id}. ${rule.title}`, rule.rule);   
        });
        message.channel.send(embed);
        let embed2 = new MessageEmbed()
        .setTitle('Reporting a user')
        .setColor(color.blue)
        .setDescription(`To report a user, we usually prefer that you use our [report form](${settings.reportForm}). Additionally, you can ping an individual moderator or the <@&${settings.roles.moderator}> role for any active server rule violations.`);
        message.channel.send(embed2);
        // convert -3 into a positive number
    }
}

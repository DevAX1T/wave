const { MessageEmbed } = require('discord.js');
const {Command} = require('discord.js-commando');
module.exports = class InviteInfoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'inviteinfo',
            group: 'mod',
            memberName: 'inviteinfo',
            description: 'Returns information about a Discord invite.',
            guildOnly: true,
            args: [
                {
                    key: 'invite',
                    prompt: 'What invite would you like to get information from?',
                    type: 'string'
                }
            ]
        });
    }
    run(message, args) {
        message.client.fetchInvite(args.invite).then(inviteObj => {
            if (inviteObj.guild) {
                let embed = new MessageEmbed()
                .setColor(color.blue)
                .setAuthor(`${inviteObj.guild.name} (${inviteObj.guild.id})`, inviteObj.guild.iconURL())
                .setDescription(`Created <t:${Math.floor(inviteObj.guild.createdTimestamp/1000)}:R>`)
                .setFooter(footer);
                message.embed(embed);
            } else {
                message.reply('I failed to get guild information for that invite.');
            }
        }).catch(() => {
            message.reply('Sorry! I failed to get information for that invite.')
        });
    }
}
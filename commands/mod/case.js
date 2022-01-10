const {Command} = require('discord.js-commando');
const {MessageEmbed} = require('discord.js');
const dayjs = require('dayjs');
dayjs.extend(require('dayjs/plugin/localizedFormat'));
module.exports = class CaseCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'case',
            aliases: ['caseinfo'],
            group: 'mod',
            memberName: 'case',
            description: 'Returns information about a given moderation case.',
            guildOnly: true,
            args: [
                {
                    key: 'caseId',
                    type: 'case',
                    prompt: 'What case would you like to view?'
                }
            ],
            examples: ['case 4194b0a1-fff5-4479-8619-3da2daa7a21f'],
        });
    }
    hasPermission(msg) {
        return PermissionManager.isModerator(msg.member)
    }
    async run(message, args) {
        // code
        await CaseManager.Case(args.caseId).then(Case => {
            let offenderTag = Case.offender?.tag || 'Unknown';
            let moderatorTag = Case.moderator?.tag || 'Unknown';
            if (offenderTag === 'Unknown' || moderatorTag === 'Unknown') {
                message.reply('Sorry! I had an error trying to get the case details. Please run this command again.');
                return;
            }
            let embed = new MessageEmbed()
            .setTitle(`Case Details`)
            .setColor(Case.color())//color.blue)
            .setAuthor(`${Case.offender.tag} (${Case.offender.id})`, Case.offender.displayAvatarURL())
            .setFooter(`${Case.moderator.tag} (${Case.moderator.id})`, Case.moderator.displayAvatarURL())
            .addField('Action', Case.Case.action, true)
            .addField('Reason', Case.Case.reason, true)
            .setTimestamp(new Date(Case.Case.createdAt * 1000).toISOString());
            if (Case.Case.expires) {
                embed.addField('Expires', dayjs.unix(Case.Case.expires).format(dformat) + ` (<t:${Case.Case.expires}:R>)`)
            }
            embed.addField('Case ID', `\`${Case.id}\``)
            message.channel.send(embed);
        }).catch(() => {
            message.reply('Sorry! I was unable to find that case.');
            return;   
        });
    }
}
const {Command} = require('discord.js-commando');
const {MessageEmbed} = require('discord.js');
const {oneLine, stripIndents} = require('common-tags');
const ms = require('ms');
const dayjs = require('dayjs');
dayjs.extend(require('dayjs/plugin/localizedFormat'));
module.exports = class CasesCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'cases',
            aliases: ['modlogs', 'history'],
            group: 'mod',
            memberName: 'modlogs',
            description: 'View a user\'s moderation history.',
            guildOnly: true,
            details: stripIndents`
                If you pass "true" or "yes" for showRawResults, it'll provide a list of case IDs in the event a page is too big.
                If you pass "true" or "yes" for showRawReason (assuming you already provided showRawResults), it'll provide the reason for each case as well.
            `,
            args: [
                {
                    key: 'user',
                    prompt: 'Which user\'s history would you like to view?',
                    type: 'user'
                },
                {
                    key: 'raw',
                    label: 'showRawResults',
                    prompt: 'Would you like to see the raw results?',
                    type: 'boolean',
                    default: false
                },
                {
                    key: 'rawReason',
                    label: 'showRawReason',
                    prompt: 'Would you like to see the raw reason with the results?',
                    type: 'boolean',
                    default: false
                }
            ]
        });
    }
    // Returns a users mod history (multiple embeds; 8 offences per embed)
    hasPermission(msg) {
        return PermissionManager.isModerator(msg.member)
    }
    async run(message, args) {
        CaseManager.Cases(args.user.id).then(async cases => {
            if (cases.length === 0) {
                message.reply('That user has no moderation history.')
            } else {
                if (args.raw) {
                    // get raw then return
                    let embed = new MessageEmbed()
                    .setTitle(`${args.user.tag}'s moderation history [${cases.length}]`)
                    .setColor(color.blue)
                    .setDescription(cases.map(c => `${args.rawReason ? `Case **${c.id}**:\n\`${c.Case.reason}\``: c.id}`).join('\n'));
                    message.channel.send(embed);
                    return;
                }
                const pagelimit = 7;
                const iterations = Math.ceil(cases.length / pagelimit);
                let page = 1;
                const embed = new MessageEmbed()
                .setTitle(`${args.user.tag}'s Moderation History [${cases.length}]`)
                .setColor(color.blue);
                let replySent;
                for (let i = 0; i < iterations; i++) {
                    const batch = cases.slice((i * pagelimit), (i * pagelimit) + pagelimit);
                    for (const Case of batch) {
                        let offenderTag = Case.offender?.tag || 'Unknown';
                        let moderatorTag = Case.moderator?.tag || 'Unknown';
                        if (offenderTag === 'Unknown' || moderatorTag === 'Unknown') {
                            message.reply('Sorry! I had an error trying to get the case details. Please run this command again.');
                            return;
                        };
                        embed.addField(`Case ${Case.id}`, stripIndents`
                            **Action:** ${Case.Case.action}
                            **Moderator:** ${Case.moderator.tag} (${Case.moderator.id})
                            **Date:** <t:${Case.Case.createdAt}:R>
                            **Reason:** ${Case.Case.reason}
                            ${( () => {
                                // check for expiration
                                if (Case.Case.expires) {
                                    return `**Duration:** ${ms((Case.Case.expires-Case.Case.createdAt)*1000, {long: true})} (Expire${
                                        Case.Case.expires > Math.floor(Date.now() / 1000) ? 's' : 'd'
                                    } <t:${Case.Case.expires}:R>)`;
                                } else return ''
                            })()}
                        `)
                    }
                    embed.setFooter(`Page ${page} of ${iterations}`);
                    if (!replySent) {
                        replySent = true;
                        await message.reply(embed);
                    } else {
                        await message.channel.send(embed);
                    }
                    embed.fields = [];
                    page++;
                }
            }
        }).catch(e => {
            message.reply('Sorry! I was unable to get that user\'s moderation history. Try running this command again.');
        });
    }
}
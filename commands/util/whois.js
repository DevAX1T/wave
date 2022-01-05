const {Command} = require('discord.js-commando');
const {MessageEmbed} = require('discord.js');
const {oneLine, stripIndents} = require('common-tags');
// use dayjs LocalizedFormat plugin
const dayjs = require('dayjs');
dayjs.extend(require('dayjs/plugin/localizedFormat'));
dayjs.extend(require('dayjs/plugin/relativeTime'));
module.exports = class WhoisCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'whois',
            aliases: ['w', 'userinfo'],
            memberName: 'whois',
            description: 'Returns information about a user.',
            group: 'util',
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 5
            },
            examples: [
                'whois DevAX1T#0001'
            ],
            args: [
                {
                    key: 'member',
                    prompt: 'Which user would you like to get information about?',
                    type: 'member',
                    // set the default value to the author of the message
                    default: (msg) => msg.member
                }
            ]
        });
    }
    hasPermission(msg) {
        return PermissionManager.isDiscord(msg)
    }
    async run(message, args) {
        let embed = new MessageEmbed()
        .setColor(colors.blue)
        .setAuthor(`${args.member.user.tag} (${args.member.user.id})`, args.member.user.displayAvatarURL())
        .setThumbnail(args.member.user.displayAvatarURL())
        .setFooter(footer)
        .setTimestamp()
        .addField('Account Created', `${dayjs(args.member.user.createdAt).format('LLL')} (${
            dayjs(args.member.user.createdAt).fromNow()
        })`, true)
        .addField('Joined Server', `${dayjs(args.member.joinedAt).format('LLL')} (${
            dayjs(args.member.joinedAt).fromNow()
        })`, true)
        .addField('Booster Since', `${
            ( () => {
                let booster = args.member.premiumSince;
                if (!booster) return 'Never';
                return dayjs(booster).format('LLL') + ` (${dayjs(booster).fromNow()})`;
            })()
        }`, true)
        //.addField('Booster since', `${dayjs(args.member.premiumSince).format('LLLL')}`, true)
        .setDescription(stripIndents`
            <@${args.member.user.id}>
            ${
                ( () => {
                    let status = args.member.user.presence.status;
                    let msg = '';
                    let emojiUsing;
                    if (status === 'online') {
                        msg = 'Online';
                        emojiUsing = emoji.presence_dnd;
                    } else if (status === 'idle') {
                        msg = 'Idle';
                        emojiUsing = emoji.presence_idle;
                    } else if (status === 'dnd') {
                        msg = 'Do Not Disturb';
                        emojiUsing = emoji.presence_dnd;
                    } else if (status === 'offline') {
                        msg = 'Offline';
                        emojiUsing = emoji.presence_invisible;;
                    }
                    return `${emojiUsing} ${msg}`;
                })()
            }
            ${
                ( () => {
                    if (args.member.user.id === message.client.user.id) {
                        return '🤖 This is me!';
                    } else return '';
                })()
            }
            ${
                ( () => {
                    let badges = '';
                    let prefix = 'This user is'
                    function append(emojiUsing, text) {
                        badges += `${emojiUsing} ${prefix} ${text}\n`
                    }
                    let isAdmin = false;
                    let conditions = [
                        {
                            condition: message.client.isOwner(args.member.user.id),
                            append: [emoji.bot_developer, 'the Bot Developer.']
                        },
                        {
                            condition: PermissionManager.isAdmin(args.member, true),
                            append: [emoji.certified_moderator, 'a Lost Islands Administrator.'],
                            runFunc: () => {isAdmin = true}
                        },
                        {
                            condition: PermissionManager.isModerator(args.member, true),
                            append: [emoji.certified_moderator, 'a Lost Islands Moderator.'],
                            runIf: () => {return isAdmin === false}
                        },
                        {
                            condition: PermissionManager.isBooster(args.member, true),
                            append: [emoji.nitro, 'a Nitro Booster.']
                        },
                        {
                            condition: PermissionManager.isVeteran(args.member, true),
                            append: [emoji.bug_hunter_gold, 'a Veteran.']
                        }
                    ]
                    conditions.forEach(cond => {
                        if (cond.condition) {
                            let result = true;
                            if (cond.runIf) {
                                result = cond.runIf();
                            }
                            if (result) {
                                // run runFunc if it exists
                                cond.runFunc?.()
                                append(cond.append[0], cond.append[1]);
                            }
                        }
                    })
                    return badges;
                })()
            }
        `)
        // Check if the user is verified with Roblox, if so, add their details here
        let verification = await $.get('users', args.member.id, 'roblox-verification').catch(() => {});
        if (verification) {
            embed.addField(`Roblox Verification`, `\`${verification.robloxName}\` [[${verification.robloxId}](https://www.roblox.com/users/${verification.robloxId}/profile)]`);
        //embed.addField('Roblox', `DevAX1T [[125196014](https://google.com/)]`)
        }
        message.channel.send(embed);
    }
}
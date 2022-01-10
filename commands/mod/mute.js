const dayjs = require('dayjs');
const {Command} = require('discord.js-commando');
function error(message, args, Case) {
    Case.errorEmbed(message.channel, 'mute');
    $.clear('cases', Case.id).catch(() => {});
    args.member.timeout(dayjs.unix(1).toISOString(), 'error-unmute')
    Case.deleteMessages();
}
module.exports = class MuteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'mute',
            aliases: ['timeout'],
            group: 'mod',
            memberName: 'mute',
            description: 'Mutes a user.',
            guildOnly: true,
            args: [
                {
                    key: 'member',
                    prompt: 'Which user do you want to mute?',
                    type: 'member'
                },
                {
                    key: 'duration',
                    prompt: 'How long do you want to mute this user?',
                    type: 'time'
                },
                {
                    key: 'reason',
                    prompt: 'What is the reason for the mute?',
                    type: 'string',
                }
            ]
        });
    }
    hasPermission(msg) {
        return PermissionManager.isModerator(msg.member)
    }
    run(message, args) {
        PermissionManager.compare(message.member, args.member).then(async () => {
            if (args.member.communicationDisabledUntilTimestamp && (args.member.communicationDisabledUntilTimestamp*1000) > Math.floor(Date.now())) {
                message.reply('Sorry! That user is already muted.');
                return;
            } else {
                let createdAt = Math.floor(Date.now() / 1000);
                let Case = CaseManager.Case({
                    createdAt: createdAt,
                    moderator: message.author.id,
                    offender: args.member.user.id,
                    action: 'mute',
                    reason: args.reason,
                    expires: createdAt + args.duration
                })
                Case.submit().then(async () => {
                    await Case.send();
                    await args.member.timeout((createdAt + args.duration) * 1000, `Case ${Case.id} | ${args.reason}`).then(async () => {
                        Case.successEmbed(message.channel, 'muted');
                    }).catch(() => {
                        error(message, args, Case);
                    })
                }).catch(() => {
                    error(message, args, Case);
                })
            }
        }).catch(() => {
            message.reply('Sorry! You\'re unable to mute that user.');
        });
    }
}
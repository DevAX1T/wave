const {Command} = require('discord.js-commando');
function error(message, args, Case) {
    Case.errorEmbed(message.channel, 'unmute');
    Case.deleteMessages();
    args.member.timeout(null, 'error-unmute');
    $.clear('cases', Case.id).catch(() => {});
}
module.exports = class UnmuteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'unmute',
            aliases: ['untimeout'],
            group: 'mod',
            memberName: 'unmute',
            description: 'Unmutes a user.',
            guildOnly: true,
            args: [
                {
                    key: 'member',
                    prompt: 'Which user do you want to unmute?',
                    type: 'member'
                },
                {
                    key: 'reason',
                    prompt: 'What is the reason for the unmute?',
                    type: 'string',
                }
            ]
        });
    }
    hasPermission(msg) {
        return PermissionManager.isModerator(msg.member)
    }
    run(message, args) {
        PermissionManager.compare(message.member, args.member).then(() => {
            if (!args.member.communicationDisabledUntilTimestamp) {
                message.reply('Sorry! That user isn\'t muted.');
                return;
            } else {
                let Case = CaseManager.Case({
                    createdAt: Math.floor(Date.now() / 1000),
                    moderator: message.author.id,
                    offender: args.member.user.id,
                    action: 'unmute',
                    reason: args.reason
                })
                Case.submit().then(async () => {
                    await Case.send();
                    await args.member.timeout(null, `Case ${Case.id} | ${args.reason}`).then(async () => {
                        Case.successEmbed(message.channel, 'unmuted');
                    }).catch(e => {
                        error(message, args, Case);
                    })
                })
            }
        })
    }
}
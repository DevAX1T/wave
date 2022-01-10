const {Command} = require('discord.js-commando');
module.exports = class WarnCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'warn',
            memberName: 'warn',
            description: 'Warns a user.',
            group: 'mod',
            guildOnly: true,
            examples: ['warn @DevAX1T#0001 spamming'],
            args: [
                {
                    key: 'member',
                    prompt: 'Which user do you want to warn?',
                    type: 'member'
                },
                {
                    key: 'reason',
                    prompt: 'What is the reason for the warning?',
                    type: 'string',
                    validate: reason => reason.length <= 250 || 'Reason must be less than 250 characters.'
                }
            ]
        });
    }
    hasPermission(msg) {
        return PermissionManager.isModerator(msg.member)
    }
    async run(message, args) {
        PermissionManager.compare(message.member, args.member).then(() => {
            let Case = CaseManager.Case({
                createdAt: Math.floor(Date.now() / 1000),
                moderator: message.author.id,
                offender: args.member.user.id,
                action: 'warn',
                reason: args.reason
            });
            Case.submit().then(async () => {
                await Case.send();
                await Case.successEmbed(message.channel, 'warned');
                // We'd do stuff, but it's a warn, not anything else
            }).catch(() => {
                message.reply('Sorry! I was unable to warn that user.');
                $.clear('cases', Case.id).catch(() => {});
                Case.deleteMessages();
            })
        }).catch(() => {
            message.reply('Sorry! You\'re unable to warn that user.');
        })
    }
}
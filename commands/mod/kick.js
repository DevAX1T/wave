const {Command} = require('discord.js-commando');
module.exports = class KickCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'kick',
            group: 'mod',
            memberName: 'kick',
            description: 'Removes a user from the Discord server.',
            guildOnly: true,
            args: [
                {
                    key: 'member',
                    prompt: 'Which user do you want to kick?',
                    type: 'member',
                },
                {
                    key: 'reason',
                    prompt: 'Why are you kicking this user?',
                    type: 'string',
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
                action: 'kick',
                moderator: message.author.id,
                offender: args.member.user.id,
                reason: args.reason,
                createdAt: Math.floor(Date.now() / 1000)
            });
            Case.submit().then(async () => {
                await Case.send();
                global.kickedMembers[args.member.user.id] = true;
                setTimeout(() => {
                    delete global.kickedMembers[args.member.user.id];
                }, 3000)
                await args.member.kick(`Case ${Case.id} | ${args.reason}`).then(async () => {
                    Case.successEmbed(message.channel, 'kicked');
                }).catch(async () => {
                  Case.errorEmbed(message.channel, 'kick');
                  $.clear('cases', Case.id).catch(() => {});
                  Case.deleteMessages();
                });
            })
        }).catch(() => {
            message.reply('Sorry! You\'re unable to kick that user.')
        })
    }
}
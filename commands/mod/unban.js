const {Command} = require('discord.js-commando');
function error(message, args, Case) {
    Case.errorEmbed(message.channel, 'unban');
    Case.deleteMessages();
    $.clear('cases', Case.id).catch(() => {});
}
module.exports = class UnbanCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'unban',
            group: 'mod',
            memberName: 'unban',
            description: 'Unbans a user from the Discord server.',
            guildOnly: true,
            args: [
                {
                    key: 'user',
                    prompt: 'Which user would you like to unban?',
                    type: 'user'
                },
                {
                    key: 'reason',
                    prompt: 'What is the reason for this unban?',
                    type: 'string',
                }
            ]
        });
    }
    hasPermission(msg) {
        return PermissionManager.isModerator(msg.member, true);
    }
    async run(message, args) {
        let isBanned;
        await message.guild.fetchBans().then(bans => {
            isBanned = bans.has(args.user.id);
        });
        if (!isBanned) {
            message.reply('Sorry! That user isn\'t banned!');
            return;
        }
        // unban the user since they are banned
        let Case = CaseManager.Case({
            reason: args.reason,
            moderator: message.author.id,
            offender: args.user.id,
            action: 'unban',
            createdAt: Math.floor(Date.now() / 1000),
        });
        Case.submit().then(async () => {
            await Case.send();
            message.guild.members.unban(args.user, `Case ${Case.id} | ${args.reason}`).then(() => {
                Case.successEmbed(message.channel, 'unbanned');
            }).catch(() => {
                error(message, args, Case);  
            });
            message.reply(`Successfully unbanned ${args.user.tag}`);
        }).catch(() => {
            error(message, args, Case);
        });
    }
}
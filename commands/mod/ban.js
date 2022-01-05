const {Command} = require('discord.js-commando');
function error(message, args, Case) {
    Case.errorEmbed(message.channel, 'ban');
    Case.deleteMessages();
    message.guild.members.unban(args.user.id, {reason:'error-unban'}).catch(() => {});
    $.clear('cases', Case.id).catch(() => {});
}
module.exports = class BanCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ban',
            group: 'mod',
            memberName: 'ban',
            description: 'Bans a user.',
            guildOnly: true,
            args: [
                {
                    key: 'user',
                    prompt: 'Which user do you want to ban?',
                    type: 'member|user'
                },
                {
                    key: 'reason',
                    prompt: 'What is the reason for the ban?',
                    type: 'string',
                }
            ]
        });
    }
    hasPermission(msg) {
        return PermissionManager.isModerator(msg.member)
    }
    run(message, args) {
        // check if the user is a member of the guild
        async function ban() {
            // check if the user is already banned in the message.guild
            let isBanned;
            await message.guild.fetchBans().then(async bans => {
                isBanned = bans.has(args.user.id);
            }).catch(() => {});
            if (isBanned) {
                message.reply('This user is already banned.');
                return;
            }
            let Case = CaseManager.Case({
                createdAt: Math.floor(Date.now() / 1000),
                moderator: message.author.id,
                offender: args.user.id,
                action: 'ban',
                reason: args.reason
            });
            await Case.submit().then(async s => {
                await Case.send();
                await message.guild.members.ban(args.user, {reason:`Case ${Case.id} | ${args.reason}`}).then(async () => {
                    Case.successEmbed(message.channel, 'banned');
                }).catch(e => {
                    error(message, args, Case);
                })
            }).catch(e => {
                error(message, args, Case);   
            });
        };
        if (args.user.guild) {
            PermissionManager.compare(message.member, args.user).then(async e => {
                ban();
            }).catch(e => {
                message.reply('Sorry! You can\'t ban that user.');
                return;
            })
        } else ban();
    }
}

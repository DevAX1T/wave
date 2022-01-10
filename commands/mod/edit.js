const {Command} = require('discord.js-commando');

module.exports = class EditCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'edit',
            aliases: ['editcase', 'reason'],
            group: 'mod',
            memberName: 'edit',
            description: 'Edits a case reason.',
            details: 'Passing in `last` as the Case ID will edit the most recent case.',
            guildOnly: true,
            args: [
                {
                    key: 'case',
                    prompt: 'Which case do you want to edit?',
                    type: 'case',
                },
                {
                    key: 'reason',
                    prompt: 'What do you want to edit the reason to be?',
                    type: 'string',
                }
            ]
        });
    }
    hasPermission(msg) {
        return PermissionManager.isModerator(msg.member);
    }
    async run(message, args) {
        await CaseManager.Case(args.case).then(async c => {
            c.edit(message.author.id, args.reason).then(() => {
                c.successEmbed(message.channel, `${emoji.auth} Successfully edited Case ${c.id}`, true);
            }).catch(() => {
                message.reply('Sorry! An error occurred while editing that case.')
            })
        }).catch(() => {
            message.reply('Sorry! That case doesn\'t exist.')
        });
    }
}
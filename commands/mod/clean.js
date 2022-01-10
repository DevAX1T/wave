const {Command} = require('discord.js-commando');
module.exports = class CleanCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'clean',
            group: 'mod',
            memberName: 'clean',
            description: 'Cleans up messages in a channel.',
            guildOnly: true,
            args: [
                {
                    key: 'amount',
                    prompt: 'How many messages would you like to delete?',
                    type: 'integer',
                    default: 50,
                    min: 1,
                    max: 100
                }
            ]
        });
    }
    hasPermission(msg) {
        return PermissionManager.isModerator(msg.member);
    }
    run(message, args) {
        let amount = args.amount;
        // mod general or announcements
        if (message.channel.id === '817913292408094751' || message.channel.id === '859280291806183444') {
            if (!PermissionManager.isAdmin(message.member, true)) {
                message.reply('Sorry! Only Admins can purge messages in this channel.');
                return;
            }
        }
        message.channel.bulkDelete(amount).then(() => {
            message.reply(`I deleted \`${amount}\` message${amount > 0 ? 's' : ''}.`);
        });
    }
}
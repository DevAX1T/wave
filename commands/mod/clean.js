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
                },
                {
                    key: 'user',
                    prompt: 'Who would you like to delete messages from?',
                    type: 'user',
                    default: ''
                }
            ]
        });
    }
    run(message, args) {
        let amount = args.amount;
        let user = args.user;
        let channel = message.channel;
        if (user) {
            channel.messages.fetch({limit: amount}).then(messages => {
                let filtered = messages.filter(m => m.author.id == user.id);
                let deleted = channel.bulkDelete(filtered);
                message.reply(`I deleted ${deleted.size} messages.`);
            });
        } else {
            channel.bulkDelete(amount).then(() => {
                message.reply(`I deleted ${amount} messages.`);
            });
        }
    }
}
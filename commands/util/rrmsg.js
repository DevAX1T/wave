const {Command} = require('discord.js-commando');
const {MessageEmbed} = require('discord.js');
const {oneLine, stripIndents} = require('common-tags');
const dayjs = require('dayjs');
module.exports = class RRcommand extends Command {
    constructor(client) {
        super(client, {
            name: 'rrmsg',
            memberName: 'rrmsg',
            description: 'Reaction roles embed',
            group: 'util',
            ownerOnly: true,
            hidden: true,
        });
    }
    async run(message, args) {
        let embed = new MessageEmbed()
        .setColor(color.blue)
        .setTitle('Reaction Roles')
        .setDescription(stripIndents`
            React to the message to get the corresponding role.

            ${emoji.hs_events}: \`Events\`
            ${emoji.mention}: \`Server Pings\`
            🔨: \`Updates\`
            
        `)
        let reactions = [
            {
                emoji: emoji.hs_events,
                role: '886134000006070323',
                message: 'Events'
            },
            {
                emoji: emoji.mention,
                role: '910666978123997254',
                message: 'Server Pings'
            },
            {
                emoji: '🔨',
                role: '886134007958499348',
                message: 'Updates'
            }
        ]
        await $.fclear('reaction-roles');
        let newMessage = await message.channel.send(embed);
        let newReactions = {};
        reactions.forEach(reaction => {
            newMessage.react(reaction.emoji)
            newReactions[reaction.emoji] = {
                role: reaction.role,
                message: reaction.message
            }
        });
        // insert the new reactions into the database
        $.set('reaction-roles', newMessage.id, newReactions);
        
    }
}
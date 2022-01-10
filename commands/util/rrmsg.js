const {Command} = require('discord.js-commando');
const {MessageEmbed} = require('discord.js');
const {stripIndents} = require('common-tags');
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
        let embed2 = new MessageEmbed()
        .setColor(color.blue)
        .setTitle('Helpful Links')
        .setDescription(`Use the links below to learn more about Lost Islands and use our forms.`)
        .addField('About Lost Islands', stripIndents`
            [Info Hub](https://docs.google.com/spreadsheets/d/10P1GFQ-wYio30wbA7N_Yjsxe8CvGSBnzR32STDc4PCg/edit#gid=854893660)
            [Changelogs & Roadmaps](https://trello.com/b/iNpxKgOA/lost-islands)
        `, true)
        .addField('Forms', stripIndents`
            [Report a user](${settings.reportForm})
            [Appeal a punishment](${settings.appealForm})
        `, true)
        // .addFields(
        //     {name: 'Information Sheet', value: `[Google Sheets]()`},
        //     {name: 'Ban Appeal Form', value: `[Google Form](${settings.appealForm})`},
        //     {name: 'Report Form', value: `[Google Form](${settings.reportForm})`},
        //     {name: 'Changelogs & Roadmaps', value: `[Trello Board]()`},
        // )
        await message.channel.send(embed2);
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
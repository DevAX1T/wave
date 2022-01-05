const { MessageEmbed } = require('discord.js');
module.exports = {
    event: 'messageUpdate',
    // external: true, // if true, the event will be called in external servers
    try: async function(oldMsg, newMsg, client) {
        if (oldMsg.partial) {
            try {
                await oldMsg.fetch();
            } catch {
                return;
            }
        }
        if (newMsg.author.bot) return;
        if (!newMsg.guild) return;
        if (newMsg.channel.name === 'admin-general') return;
        if (newMsg.content === oldMsg.content) return;
        let embed = new MessageEmbed()
        .setColor(colors.discordYellow)
        .setTitle('Message Update')
        .setAuthor(`${newMsg.author.tag} (${newMsg.author.id})`, newMsg.author.displayAvatarURL())
        .setDescription(`<@${newMsg.author.id}> edited their [message](${newMsg.url}) sent in <#${newMsg.channel.id}>`)
        //.setDescription(`edited their [message](${newMsg.url}) in <#${newMsg.channel.id}>`)
        .addField('Before', oldMsg.content || 'Unable to retreive old content', true)
        .addField('After', newMsg.content, true)
        .setTimestamp()
        .setFooter(footer);
        client.channels.cache.get(settings.channels.discord_logs).send(embed)
    }
}
const { MessageEmbed } = require('discord.js');
module.exports = {
    event: 'messageUpdate',
    try: async function(oldMsg, newMsg, client) {
        if (oldMsg.partial) {
            try {
                await oldMsg.fetch();
            } catch {
                return;
            }
        }
        if (!hookValidate(oldMsg)) return;
        if (newMsg.author.bot) return;
        if (!newMsg.guild) return;
        if (newMsg.channel.name === 'admin-general') return;
        if (newMsg.content === oldMsg.content) return;
        let embed = new MessageEmbed()
        .setColor(colors.discordYellow)
        .setTitle('Message Update') //! FIX THE BAD EMBED VISUALS AND WHATNOT
        .setAuthor(`${newMsg.author.tag} (${newMsg.author.id})`, newMsg.author.displayAvatarURL())
        .setDescription(`[Message](${newMsg.url}) sent by <@${newMsg.author.id}> in <#${newMsg.channel.id}> was edited.`)
        .addField('Before', oldMsg.content || 'Unable to retrieve old content', true)
        .addField('After', newMsg.content, true)
        .setTimestamp()
        .setFooter(footer);
        client.channels.cache.get(settings.channels.discord_logs).send(embed)
    }
}
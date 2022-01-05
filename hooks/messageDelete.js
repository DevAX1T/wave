const { MessageEmbed } = require('discord.js');
const { message } = require('noblox.js');
module.exports = {
    event: 'messageDelete',
    // external: true, // if true, the event will be called in external servers
    try: async function(message, client) {
        /*
        UNRELATED! GSERVER HAS A COUNT OF 25 PEOPLE PER EMBED!

        */
        //if (message.author.bot) return;
        // make sure to check if the message is a guild message
        if (message.partial) return;
        if (!message.guild) return;
        if (message.channel.name === 'admin-general') return; // Don't log messages sent in admin-general
        if (message.author.bot) return;
        // Normal message deletion logs
        let embed = new MessageEmbed()
        .setColor(color.discordRed)
        .setTitle('Message Deleted')
        .setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())
        .setDescription(`<@${message.author.id}>'s [message](${message.url}) sent in <#${message.channel.id}> was deleted`)
        //.setDescription(`[Message](${message.url}) sent in <#${message.channel.id}> from <@${message.author.id}> was deleted.`)
        .addField('Content', message.content || 'No Content')
        .setTimestamp()
        .setFooter(footer);
        message.client.channels.cache.get(settings.channels.discord_logs).send(embed);
    }
}
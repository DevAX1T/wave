const { MessageEmbed } = require('discord.js');
const dayjs = require('dayjs');
dayjs.extend(require('dayjs/plugin/localizedFormat'));
module.exports = {
    event: 'messageDelete',
    try: async function(message, client) {
        //if (message.author.bot) return;
        // make sure to check if the message is a guild message
        if (message.partial) return;
        if (!hookValidate(message)) return;
        if (!message.guild) return;
        if (message.channel.name === 'admin-general') return; // Don't log messages sent in admin-general
        if (message.author.bot) return;
        // Normal message deletion logs
        let embed = new MessageEmbed()
        .setColor(color.discordRed)
        .setTitle('Message Deleted')
        .setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())
        .setDescription(`[Message](${message.url}) sent by <@${message.author.id}> in <#${message.channel.id}> was deleted.`)
        .addField('Sent', `<t:${Math.floor(message.createdTimestamp/1000)}:R>`, true)
        .addField('Content', message.content || 'No Content', true)
        .setTimestamp()
        .setFooter(footer);
        message.client.channels.cache.get(settings.channels.discord_logs).send(embed);
    }
}
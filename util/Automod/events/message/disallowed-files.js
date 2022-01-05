const { MessageEmbed } = require("discord.js");

module.exports = (message) => {
    if (message.partial) return;
    if (message.author.bot) return;
    if (!message.guild) return;
    message.attachments.forEach(attachment => {
        let extension = attachment.name.split('.').pop();
        let isFound;
        settings.allowedExtensions.forEach(ext => {
            if ('.' + extension === ext) {
                isFound = true;
            }
        });
        if (!isFound) {
            message.delete();
            message.reply('Sorry! That type of file extension is not allowed.');
            let embed = new MessageEmbed()
            .setTitle('Automod: Disallowed File')
            .setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())
            .setColor(color.discordRed)
            .setDescription(`<@${message.author.id}> sent a [disallowed file](${message.url}) (\`.${extension}\`) in <#${message.channel.id}>`)
            .setFooter(footer)
            .setTimestamp()
            .addField('File Name', attachment.name);
            message.client.channels.cache.get(settings.channels.discord_logs).send(embed);
        }
    })
}
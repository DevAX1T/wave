const { MessageEmbed } = require("discord.js");

module.exports = (message) => {
    if (message.partial) return;
    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content) return;
    let regex = /discord(?:(?:app)?\.com\/invite|\.gg(?:\/invite)?)\/([\w-]{2,255})/gi;
    let matches = message.content.match(regex);
    if (matches && matches.length > 0) {
        let invite = matches[0];
        message.client.fetchInvite(invite).then(inviteObj => {
            if (inviteObj.guild.id !== settings.guild && (message.channel.name !== 'mod-general' || message.channel.name !== 'admin-general')) {
                message.delete()
                let embed = new MessageEmbed()
                .setColor(colors.discordRed)
                .setTitle('Automod: Anti-Invite')
                .setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())
                .setDescription(`${message.author.tag} tried to [send an invite](${message.url}) to \`${inviteObj.guild.name}\` (${inviteObj.guild.id})`)
                .addField('Invite Code', invite, true)
                .setFooter(footer)
                .setTimestamp();
                message.client.channels.cache.get(settings.channels.discord_logs).send(embed);
            }
        }).catch(() => {
            message.delete();
            return;
        })
    }
}
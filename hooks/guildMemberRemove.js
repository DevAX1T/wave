const {MessageEmbed} = require('discord.js');
module.exports = {
    event: 'guildMemberRemove',
    try: function(member, client) {
        if (!hookValidate(member)) return;
        if (global.kickedMembers[member.user.id]) return;
        let channel = member.guild.channels.cache.get(settings.channels.discord_logs);
        let embed = new MessageEmbed()
        .setColor(color.discordRed)
        .setTitle('User left')
        .setAuthor(`${member.user.tag} (${member.user.id})`, member.user.displayAvatarURL())
        .setDescription(`<@${member.user.id}> left the server.`)
        .setTimestamp()
        .setFooter(footer);
        channel.send(embed);
    }
}
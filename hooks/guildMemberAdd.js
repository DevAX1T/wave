const {MessageEmbed} = require('discord.js');
module.exports = {
    event: 'guildMemberAdd',
    try: function(member, client) {
        // First of all send a user joined message in discord logs
        if (member.guild.id !== settings.guild) return;
        let channel = member.guild.channels.cache.get(settings.channels.discord_logs);
        let embed = new MessageEmbed()
        .setColor(color.discordGreen)
        .setTitle('User joined')
        .setAuthor(`${member.user.tag} (${member.user.id})`, member.user.displayAvatarURL())
        .setDescription(`<@${member.user.id}> joined the server.`)
        .setTimestamp()
        .setFooter(footer);
        channel.send(embed);
        // Then send a welcome message to the user if joinDM is enabled
        if (settings.joinDM) {
            let welcomeMessage = settings.welcomeMessage;
            welcomeMessage = welcomeMessage.replace('%USERNAME%', member.user.username);
            welcomeMessage = welcomeMessage.replace('%SERVER%', member.guild.name);
            welcomeMessage = welcomeMessage.replace('%CHANNEL%', `<#${settings.channels.verification}>`);
            welcomeMessage = welcomeMessage.replace('%PREFIX%', client.commandPrefix);
            member.send(welcomeMessage);
        }
        // Add account filter
        let accountAge = member.user.createdTimestamp * 1000;
        let now = Date.now();
        let diff = now - accountAge;
        let days = Math.floor(diff / (1000 * 60 * 60 * 24));
        console.log(days)
    }
}
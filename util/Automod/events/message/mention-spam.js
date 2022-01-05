const { MessageEmbed } = require("discord.js");

module.exports = async (message) => {
    if (!message.guild) return;
    let isMod = PermissionManager.isModerator(message.member, true);
    if (!isMod) {
        if (message.mentions.users.size >= 5) {
            message.delete();
            let Case = CaseManager.Case({
                reason: `Automod: Mention Spam (${message.mentions.users.size} mentions)`,
                moderator: message.client.user.id,
                offender: message.author.id,
                action: 'ban'
            });
            await Case.submit().then(async () => {
                await Case.send();
                global.kickedMembers[message.author.id] = true;
                setTimeout(() => {
                    delete global.kickedMembers[message.author.id];
                }, 3000);
                await message.member.ban({
                    reason: `[A] Case ${Case.id} | ${Case.Case.reason}`,
                    days: 1
                });
            }).catch(() => {});
        }
    }
}
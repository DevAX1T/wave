module.exports = async (message) => {
    if (!message.guild) return;
    if (!hookValidate(message)) return;
    if (message.mentions.users.size >= 5 && !PermissionManager.isModerator(message.member, true)) {
        message.delete();
        let Case = CaseManager.Case({
            reason: `Automod: Mention Spam (${message.mentions.users.size} mentions)`,
            moderator: message.client.user.id,
            offender: message.author.id,
            action: 'ban'
        });
        Case.submit().then(async () => {
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
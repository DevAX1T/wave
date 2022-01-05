class PermissionManager {
    constructor(messagesOverride) {
        this.messages = {
            discord: 'Sorry! This command must be ran in the Lost Islands Discord.',
            mod: 'Sorry! You must be a Moderator or Admin to run this command.',
            admin: 'Sorry! You must be an Admin to run this command.',
            creator: 'Sorry! You must have the `Content Creator` role to run this command.',
            booster: 'Sorry! You must be a Nitro Booster to run this command',
            veteran: 'Sorry! You must be a Veteran to run this command.',
            modChannel: 'Sorry! This command must be ran in a moderation channel.'
        }
    }
    compare(member1, member2) {
        return new Promise((resolve, reject) => {
            if (member1.id === member2.id) reject(false);
            if (member1.client.isOwner(member1.user)) resolve(true); // owner can do anything
            let isMod1 = this.isModerator(member1, true);
            let isMod2 = this.isModerator(member2, true);
            let isAdmin1 = this.isAdmin(member1, true);
            let isAdmin2 = this.isAdmin(member2, true);
            if (isAdmin1 && !member1.client.isOwner(member2.user)) resolve(true); // admin can do anything but punish owner
            if ((isMod1 && isMod2) || (isMod1 && isAdmin2)) reject(false); // mods can't do mod actions on mods or admins
            resolve(true) // mods can do stuff to normal people; admins can do stuff to each other
        });
        //member1 executor, member2 target
    }
    isDiscord(obj, strict) { // return true if message is from the Lost Islands discord server
        // get the type of the message
        let condition = obj.guild.id === settings.guild;
        return strict ? condition : (condition || this.messages.discord)
    }
    isModChannel(msg, strict) {
        if (!this.isDiscord(msg, strict)) return this.messages.discord;
        let channelId = ['817913292408094751', '817914439789314049'] // 0: mod, 1: admin
        let condition = msg.channel.id === channelId[0] || msg.channel.id === channelId[1]
        return strict ? condition : (condition || this.messages.modChannel)
    }
    isContentCreator(member, strict) {
        if (!this.isDiscord(member, strict)) return this.messages.discord;
        let condition = member.roles.cache.some(role => role.id === settings.roles.contentCreator);
        return strict ? condition : (condition || this.messages.creator)
    }
    isBooster(member, strict) {
        if (!this.isDiscord(member, strict)) return this.messages.discord;
        let condition = member.roles.cache.some(role => role.id === settings.roles.booster);
        return strict ? condition : (condition || this.messages.booster)
    }
    isVeteran(member, strict) {
        if (!this.isDiscord(member, strict)) return this.messages.discord;
        let condition = member.roles.cache.some(role => role.id === settings.roles.veteran);
        return strict ? condition : (condition || this.messages.veteran)
    }
    isModerator(member, strict) {
        if (!this.isDiscord(member, strict)) return this.messages.discord;
        let condition = (member.roles.cache.some(role => role.id === settings.roles.moderator || role.id === settings.roles.admin));
        return strict ? condition : (condition || this.messages.mod)
    }
    isAdmin(member, strict) {
        if (!this.isDiscord(member, strict)) return this.messages.discord;
        let condition = member.roles.cache.some(role => role.id === settings.roles.admin)
        return strict ? condition : (condition || this.messages.admin)
    }
}
module.exports = PermissionManager;
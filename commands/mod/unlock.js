const {Command} = require('discord.js-commando');
const ms = require('ms');
module.exports = class UnlockCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'unlock',
            group: 'mod',
            memberName: 'unlock',
            description: 'Unlocks a discord channel.',
            guildOnly: true
        });
    }
    
    hasPermission(msg) {
        return PermissionManager.isModerator(msg.member);
    }
    run(message) {
        let vg = settings.channels.vetgen;
        let cc = settings.channels.contentcreators;
        if (message.channel.id === vg || message.channel.id === cc) {
            message.reply('You cannot unlock this channel.');
            return;
        }
        let canLock = message.channel.permissionsFor(message.guild.id)?.has('SEND_MESSAGES');
        if (!canLock) {
            message.channel.updateOverwrite(message.guild.id, {SEND_MESSAGES: true}).then(() => {
                message.channel.send(`🔓 This channel is now unlocked.`).then(() => {
                    $.clear('locked-channels', message.channel.id);
                })
            }).catch(e => {
                message.reply('Sorry! I had an error trying to unlock the channel.')
            });
        } else {
            message.reply('This channel is already unlocked.');
        }
    }
}
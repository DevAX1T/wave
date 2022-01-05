const {Command} = require('discord.js-commando');
const ms = require('ms');
module.exports = class LockCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'lock',
            group: 'mod',
            memberName: 'lock',
            description: 'Locks a discord channel for the specified time.',
            guildOnly: true,
            args: [{
                key: 'duration',
                prompt: 'How long should the channel be locked for?',
                type: 'time',
                default: ''
            }]
        });
    }
    
    hasPermission(msg) {
        return PermissionManager.isModerator(msg.member);
    }
    run(message, args) {
        let vg = settings.channels.vetgen;
        let cc = settings.channels.contentcreators;
        if (message.channel.id === vg || message.channel.id === cc) {
            message.reply('You cannot lock this channel.');
            return;
        }
        let canLock = message.channel.permissionsFor(message.guild.id)?.has('SEND_MESSAGES');
        if (!canLock) {
            message.reply('This channel is already locked.');
        } else {
            message.channel.updateOverwrite(message.guild.id, {SEND_MESSAGES: false}).then(() => {
                // Store the lock on the database
                message.channel.send(`🔒 This channel has been locked by <@${message.author.id}>${(() => {
                    if (args.duration) {
                        return ` for ${ms(args.duration*1000, {long: true})}.`;
                    } else return '.'
                })()}`).then(() => {
                    $.set('locked-channels', message.channel.id, {
                        expires: args.duration ? Math.floor(Date.now() / 1000) + args.duration : null,
                        moderator: message.author.id,
                        guild: message.guild.id
                    });
                })
            }).catch(e => {
                message.reply('Sorry! I had an error trying to lock the channel.')
            });
        }
    }
}
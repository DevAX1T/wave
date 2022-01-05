const {Command} = require('discord.js-commando');
const {MessageEmbed, User} = require('discord.js');
const {oneLine, stripIndents} = require('common-tags');
const dayjs = require('dayjs');
const noblox = require('noblox.js');
function getInformation(message, userId) {
    return new Promise( async (resolve, reject) => {
       let embed = new MessageEmbed()
       .setColor(color.blue)
       .setTitle('Username or UserId')
       .setDescription('Please respond with the corresponding emoji.')
       .addField(`${emoji.number[0]}: Username`, 'Roblox Username')
       .addField(`${emoji.number[1]}: UserId`, 'Roblox UserId')
       .setTimestamp()
       .setFooter(footer);
        let reactMsg = await message.reply(embed);
        try {
            reactMsg.react(emoji.number[0]);
            reactMsg.react(emoji.number[1]);
        } catch {
            reactMsg.edit('Sorry! One of the emojis failed to react.')
            reactMsg.reactions.removeAll();
            reject(false);
            return;
        }
        const filter = (reaction, user) => {
            return (
                user.id === message.author.id &&
                (reaction.emoji.name === emoji.number[0] || reaction.emoji.name === emoji.number[1]) &&
                reaction.message.id === reactMsg.id
            )
        }
        // now wait for reactions lol
        await reactMsg.awaitReactions(filter, {max: 1, time: 30000, errors: ['time']}).then(async collected => {
            let reaction = collected.first();
            if (reaction.emoji.name === emoji.number[0]) {
                // convert number into a string
                userId = await noblox.getIdFromUsername(userId.toString()).catch((e) => {
                    message.reply('Sorry! I could not find that user.');
                    reject(false);
                    return;
                });
                resolve(userId);
                reactMsg.delete();
            } else {
                // they chose userId so resolve into userId lol
                resolve(userId);
                reactMsg.delete();
            }
    
        }).catch(collected => {
            reactMsg.edit('Sorry! You took too long to respond.');
            reactMsg.reactions.removeAll();
            reject(false);
            return;
        });
    }).catch(() => {
       return; 
    });
}
function userSearch(message, user) {
    // check if user is a number
    if (!isNaN(user)) {
        // Roblox userid
        message.reply(`Ban by Roblox account \`${user}\``)
    } else {
        // Discord account
        message.reply(`Ban by Discord account \`${user.tag}\``)
    }
}
module.exports = class UltrabanCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'uban', // Lookup command - returns user accounts
            aliases: ['ultraban'],
            memberName: 'uban',
            description: 'Bans a user from both the Discord and game.',
            group: 'mod',
            format: '<RobloxUser / DiscordId>',
            guildOnly: true,
            hidden: true,
            args: [
                {
                    key: 'user',
                    prompt: 'Who do you want to ban?',
                    type: 'rbxdiscorduser|user'
                },
                {
                    key: 'reason',
                    prompt: 'What is the reason for this ban?',
                    type: 'string',
                }
            ]
        });
    }
    hasPermission(msg) {
        return PermissionManager.isModerator(msg.member);
    }
    async run(message, args) {
        let user = args.user;
        userSearch(message, user);
    }
}
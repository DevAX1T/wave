const { MessageEmbed } = require('discord.js');
const {Command} = require('discord.js-commando');
function getColor(_color) {
    let _colors = {
        red: color.discordRed,
        blue: color.blue,
        green: color.discordGreen,
        yellow: color.discordYellow,
        orange: color.orange,
        grey: color.grey,
        black: color.black,
        white: color.white,
        blurple: color.blurple,
        ogblurple: color.ogBlurple,
        purple: color.purple,
        gold: color.gold,
        aqua: color.aqua,
        turquoise: color.turquoise,
        boosterpink: color.boosterPink,
        maroon: color.maroon,
        discordpink: color.discordPink,
    }
    return _colors[_color.toLowerCase()]
}
module.exports = class SayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'say',
            group: 'admin',
            memberName: 'say',
            description: 'Creates a message embed with the given content',
            guildOnly: true,
            args: [
                {
                    key: 'channel',
                    prompt: 'Which channel do you want to send the message to?',
                    type: 'channel'
                },
                {
                    key: 'color',
                    prompt: 'What color would you like the embed to be?',
                    type: 'string',
                    default: 'blue',
                    validate: _color => getColor(_color)
                }
            ]
        });
    }
    hasPermission(message) {
        return PermissionManager.isAdmin(message.member);
    }
    run(message, args) {
        let embed = new MessageEmbed()
        .setColor(getColor(args.color));
        // Prompt the user for the title
        let filter = [m => m.author.id === message.author.id, {time: 600000, max: 1, errors: ['time']}]
        message.channel.send('What would you like the title to be?').then(async msg => {
            message.channel.awaitMessages(...filter).then(async msgs => {
                let title = msgs.first().content;
                embed.setTitle(title.toLowerCase() === 'none' || title.toLowerCase() === 'n/a' ? null : title);
                message.channel.send('What would you like the description to be?').then(async msg2 => {
                    message.channel.awaitMessages(...filter).then(async msgs2 => {
                        embed.setDescription(msgs2.first().content || null);
                        message.channel.send('Do you want to customize this embed more?').then(async msg3 => {
                            message.channel.awaitMessages(...filter).then(async msgs3 => {
                                let msg3_ = msgs3.first().content.toLowerCase();
                                let bulkdeletes = [
                                    message,
                                    msg,
                                    msg2,
                                    msg3,
                                    msgs.first(),
                                    msgs2.first(),
                                    msgs3.first()
                                ]
                                if (!(msg3_ === 'y' || msg3_ === 'yes')) {
                                    args.channel.send(embed).then(() => {
                                        message.channel.bulkDelete(bulkdeletes).catch(() => {});
                                        message.channel.send('Message sent!');
                                        return;
                                    })
                                } else {
                                    // Ask for more info
                                    message.channel.send('What would you like the footer to be?').then(async msg4 => {
                                        message.channel.awaitMessages(...filter).then(async msgs4 => {
                                            embed.setFooter(msgs4.first().content || null);
                                            bulkdeletes.push(msg4);
                                            args.channel.send(embed).then(() => {
                                                message.channel.bulkDelete(bulkdeletes).catch(() => {});
                                                message.channel.send('Message sent!');
                                                return;
                                            }).catch(() => {
                                                message.channel.send('Something went wrong.');
                                                message.channel.bulkDelete(bulkdeletes)
                                                return;
                                            })
                                        }).catch(() => {
                                            message.channel.send('Sorry! You took too long to respond.');
                                            return;
                                        })
                                    })
                                }
                            }).catch(() => {
                                message.channel.send('Sorry! You took too long to respond.');
                                return;
                            })
                        })
                    }).catch(() => {
                        message.channel.send('Sorry! You took too long to respond.');
                        return;
                    }); 
                })
            }).catch(() => {
                message.reply('Sorry! You took too long to respond.');
                return;
            });
        });
    }
}
const { MessageEmbed } = require('discord.js');
const {Command} = require('discord.js-commando');
module.exports = class DeleteCaseCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'deletecase',
            aliases: ['delcase', 'void'],
            group: 'admin',
            memberName: 'deletecase',
            description: 'Deletes a case or clears a user\'s moderation history.',
            guildOnly: true,
            args: [
                {
                    key: 'caseUser',
                    prompt: 'Which case do you want to delete?',
                    type: 'user|case'
                }
            ]
        });
    }
    hasPermission(msg) {
        return PermissionManager.isAdmin(msg.member);
    }
    run(message, args) {
        if (typeof args.caseUser === 'string') {
            $.get('cases', args.caseUser).then(async c => {
                $.get('users', c.offender).then(async user => {
                    $.query().table('cases').getAll(...user.history).delete().run($.conn).then(() => {
                        $.update('users', user.id, {history: []}).then(() => {
                            let embed = new MessageEmbed()
                            .setColor(color.discordRed)
                            .setDescription(`${emoji.auth} Successfully deleted Case \`${args.caseUser}\`!`);
                            message.reply(embed);
                        }).catch(() => {
                            message.reply('An error occurred while clearing the user\'s history.');
                        })
                    }).catch(() => {
                        message.reply('Failed to delete cases.');
                        return;
                    })
                }).catch((e) => {
                    console.log(e)
                    message.reply('Sorry! I experienced an error.')
                    return;
                });
            }).catch(() => {
                message.reply('Sorry! That case doesn\'t exist.')
            });
        } else {
            // This is a user, so clear modlogs for them
            $.get('users', args.caseUser.id).then(async user => {
                $.query().table('cases').getAll(...user.history).delete().run($.conn).then(() => {
                    $.update('users', args.caseUser.id, {history: []}).then(() => {
                        let embed = new MessageEmbed()
                        .setColor(color.discordRed)
                        .setDescription(`${emoji.auth} Successfully deleted all cases for ${args.caseUser.tag}!`);
                        message.reply(embed);
                    }).catch(() => {
                        message.reply('Sorry! An error occurred while saving the user\'s history.');
                    });
                }).catch((e) => {
                    console.log(e)
                    message.reply('Sorry! An error occurred while deleting the user\'s cases.')
                })
            }).catch(() => {
                message.reply('Sorry! An error occurred while trying to get that user\'s history.');
            })
        }
    }
}
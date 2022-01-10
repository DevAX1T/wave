const {Command} = require('discord.js-commando');
const {MessageAttachment} = require('discord.js');
const fs = require('fs');
const {oneLine, stripIndents} = require('common-tags');
const dayjs = require('dayjs');
// extend dayjs LocalizedFormat plugin
dayjs.extend(require('dayjs/plugin/localizedFormat'));
module.exports = class ErrorCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'error',
            memberName: 'error',
            description: 'Allows the user to manage errors',
            group: 'util',
            ownerOnly: true,
            hidden: true,
            examples: [
                'error *',
                'error * delete',
                'error aaede0e0-e320-43d4-8ab2-ba2e585cde1b',
                'error aaede0e0-e320-43d4-8ab2-ba2e585cde1b delete'
            ],
            args: [
                {
                    key: 'id',
                    prompt: 'Do you want to get a specific error or all (*)?',
                    type: 'string'
                },
                {
                    key: 'action',
                    prompt: 'What is the reason for the warning?',
                    type: 'string',
                    default: '',
                    validate: (action) => {
                        if (action && action !== '') {
                            return action.toLowerCase() === 'delete';
                        } else {
                            return true;
                        }
                    }
                }
            ]
        });
    }
    async run(message, args) {
        if (args.action && args.action === 'delete') {
            // Delete the error provided
            if (args.id === '*') {
                $.fclear('errors').then(() => {
                    message.reply('Successfully deleted all errors!');
                }).catch(err => {
                    message.reply(`Failed to delete error: \`${err.stack}\``) 
                });
            } else {
                $.clear('errors', args.id).then(() => {
                    message.reply(`Successfully deleted error \`${args.id}\``);
                }).catch(err => {
                    message.reply(`Failed to delete error: \`${err.stack}\``)
                });
            }
        } else {
            // we're just returning some info about the error
            let error = await ErrorManager.get(args.id);
            // check if error is an array
            if (!error) {
                message.reply(`Could not find error \`${args.id}\``)
                return;
            };
            if (Array.isArray(error)) {
                // Return a list of errors
                let str = stripIndents`Log generated on ${dayjs().format(dformat)} [Count ${error.length}]
                
                ------------------------------------------------------------------
                ` + '\n'
                error.forEach(err => {
                    str += stripIndents`
                    ${dayjs.unix(err.created).format(dformat)} | ${
                        err.command ? `${err.type} | ${err.command}` : err.type
                    } | ${err.id}: ${err.error}
                    ` + '\n\n'
                });
                // create a new text file in cache
                let unixtime = dayjs().unix().toString();
                let path = `./cache/error_log_${unixtime}.txt`
                fs.writeFile(path, str, (e) => {if (e) throw (e)});
                let msgAttachment = new MessageAttachment(path);
                await message.channel.send(msgAttachment);
                fs.unlink(path, (e) => {if (e) throw (e)});
               // message.reply(str);
                
            } else {
                // if not, we're just returning the error
                message.reply(oneLine`
                Error \`${error.id}\` (${
                    error.command ? `${error.type} \`${error.command}\`` : error.type
                }) was created at \`${dayjs.unix(error.created).format(dformat)}\`
                and contains the following content:
                \n
                \`\`\`
                ${error.error}
                \`\`\`
                `)
            }
        }
        
    }
}
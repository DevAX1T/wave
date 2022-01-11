const {Command} = require('discord.js-commando');
const {MessageEmbed} = require('discord.js');
const {stripIndents} = require('common-tags');
const dayjs = require('dayjs');
module.exports = class InfoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'info',
            aliases: ['about', 'uptime'],
            memberName: 'info',
            description: 'Displays information about the bot.',
            group: 'util',
            throttling: {
                usages: 2,
                duration: 10
            }
        });
    }
    run(message) {
        let seconds = Math.floor(process.uptime());
        let minutes = (seconds - seconds % 60) / 60;
        seconds -= minutes * 60;
        let hours = (minutes - minutes % 60) / 60;
        minutes -= hours * 60;
        let embed = new MessageEmbed()
        .setAuthor(message.client.user.username, message.client.user.avatarURL())
        .setDescription(stripIndents`
        A moderation and utility bot designed and developed for Lost Islands.
        `)
        .addField('Version', message.client.version, true)
        .addField('Library', 'Commando', true)
        .addField('Creator', `<@${message.client.owners[0].id}>`, true)
        .addField('Operating System', isWindows ? 'Windows' : 'Linux', true)
        .addField('Uptime', `${hours} hrs, ${minutes} min, ${seconds} sec`, true)
        .setFooter(dayjs.unix(botUptime).format('Up [s]ince l LT PST'))
        // get timezone
        .setColor(color.blue);
        message.channel.send(embed);
            
    }
}
const {MessageAttachment } = require('discord.js');
const fs = require('fs');
const dayjs = require('dayjs');
dayjs.extend(require('dayjs/plugin/localizedFormat'));
module.exports = {
    event: 'messageDeleteBulk',
    try: async function(messages, client) {
        if (!hookValidate(messages.first())) return;
        let str = '';
        messages.forEach(message => {
            if (!message.partial) {
                str += `${message.author.tag} (${message.author.id}) [${dayjs(message.createdAt).format(dformat)}]\n${message.content}\n\n`;
            }
        });
        if (str != '') {
            let channel = await client.channels.cache.get(settings.channels.discord_logs)
            // Embed will be created in the clean command
            let path = `./cache/log_${dayjs().unix().toString()}.txt`
            fs.writeFile(path, str, (e) => {if (e) throw (e)});
            let msgAttachment = new MessageAttachment(path);
            await channel.send(msgAttachment);
            fs.unlink(path, (e) => {if (e) throw (e)});
        }
    }
}
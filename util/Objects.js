const uuid = require('uuid/v4');
const axios = require('axios');
const ms = require('ms');
const { MessageEmbed } = require('discord.js');
const { oneLine, stripIndents } = require('common-tags');
const dayjs = require('dayjs');
dayjs.extend(require('dayjs/plugin/localizedFormat'));
function checkReason(reason) {
    // check if reason has the format "rule #" and then get the number said. If not,
    let rule = reason.match(/^r(?:ule)?(?:\s)?(\d+)$/i);
    if (rule && rule[1] <= settings.rules.length) {
        let ruleFound = settings.rules.find(r => r.id == rule[1]);
        return `**Rule ${ruleFound.id}. \`${ruleFound.title}\`**: \n${ruleFound.rule}`;
    } else {
        return reason
    }
}
class DiscordCase {
    // add a user() which returns the discord user (using discord client)
    constructor(Case) {
        this.isNew = !Case.id
        if (this.isNew) {
            Case.reason = checkReason(Case.reason);
        }
        Case.id = Case.id || uuid();
        Case.history = Case.history || [];
        Case.createdAt = Case.createdAt || Math.floor(Date.now() / 1000);
        this.Case = Case;
        this.id = Case.id;
        $client.users.fetch(this.Case.offender).then((user) => {
            this.offender = user;
        }).catch(() => {})
        $client.users.fetch(this.Case.moderator).then((user) => {
            this.moderator = user;
        }).catch(() => {});
    }
    color(orAction) {
        let action = orAction || this.Case.action;
        let actions = {
            ban: 'discordRed',
            tban: 'discordRed',
            unban: 'darkGreen',
            mute: 'darkAqua',
            unmute: 'lightAqua',
            warn: 'discordYellow',
            kick: 'orange',
        }
        return color[actions[action]];
    }
    async successEmbed(channel, message, override) {
        if (!override) {
            message = `${emoji.auth} Successfully ${message} ${this.offender.tag}`
        }
        let embed = new MessageEmbed()
        .setColor(color.blue)
        .setDescription(message)
        .setFooter(`Case ${this.id}`);
        channel.send(embed);
    }
    async errorEmbed(channel, message, override) {
        if (!override) {
            message = `${emoji.x} Failed to ${message} ${this.offender.tag}`
        }
        let embed = new MessageEmbed()
        .setColor(color.discordRed)
        .setDescription(message);
        channel.send(embed);
    }
    async deleteMessages() {
        this.LogEmbed?.delete();
        this.DMEmbed?.delete();
    }
    async send() {
        return new Promise(async (resolve, reject) => {
            let action = this.Case.action.includes('ban') ? 'ban' : this.Case.action;
            let embedcolor = this.color();//color[actions[action]];
            let channel = await $client.channels.cache.get(settings.channels.discord_logs);
            let embed = new MessageEmbed()
            .setTitle('Moderation Action')
            .setAuthor(`${this.offender.tag} (${this.offender.id})`, this.offender.displayAvatarURL())
            .setFooter(`${this.moderator.tag} (${this.moderator.id})`, this.moderator.displayAvatarURL())
            .setTimestamp()
            .setColor(embedcolor)
            .addField('Action', this.Case.action, true)
            .addField('Reason', this.Case.reason, true)
            if (this.Case.expires) {
                embed.addField('Expires', dayjs.unix(this.Case.expires).format(dformat) + ` (<t:${this.Case.expires}:R>)`);
            }
            embed.addField('Case ID', `\`${this.Case.id}\``);
            this.LogEmbed = await channel.send(embed);
            if (this.Case.action === 'unban') {
                resolve();
                return;
            }
            let DMEmbed = new MessageEmbed()
            .setTitle('Moderation Action')
            .setFooter(`${this.moderator.tag} (${this.moderator.id})`, this.moderator.displayAvatarURL())
            .addField('Action', this.Case.action, true)
            .addField('Reason', this.Case.reason, true)
            .setColor(embedcolor);
            if (this.Case.expires) {
                DMEmbed.addField('Expires', dayjs.unix(this.Case.expires).format(dformat) + ` (<t:${this.Case.expires}:R>)`);
            }
            DMEmbed.addField('Case ID', `\`${this.Case.id}\``);
            let useractions = { // A moderator has [action]
                warn: ['warned', 'in'],
                kick: ['kicked', 'from'],
                mute: ['muted', 'in'],
                unmute: [ 'unmuted', 'in'],
                unban: ['unbanned', 'from'],
                softban: ['softbanned', 'in'],
                tban: ['temporarily banned', 'from'],
                ban: ['banned', 'from'],
            }
            let ua = this.Case.action;
            let useraction = useractions[ua];
            let baseMessage = stripIndents`
                A moderator has ${useraction[0]} you ${useraction[1]} the Lost Islands Discord.
                You may appeal this action via the [appeal form](${settings.appealForm}).`;
            let discordMessage = `[Additionally, you can click me to rejoin the server.](${settings.discordInvite}).`
            let addMessage = (ua != 'warn' && ua != 'mute' && ua!= 'unmute')
            if (addMessage) {
                baseMessage += `\n${discordMessage}`;
            }
            DMEmbed.setDescription(baseMessage)
            this.DMEmbed = await this.offender.send(DMEmbed).catch(() => {});
            resolve();
        })
    }
    async submit() {
        return new Promise((resolve, reject) => {
            $.query().table('cases').insert(this.Case).run($.conn).then(async (res) => {
                // then add the case to the user history
                const result = await $.get('users', this.Case.offender).catch((e) => {
                    reject(e);
                });
                if (result) {
                    // Append the case to the user history
                    $.query().table('users').get(this.Case.offender).update({
                        history: r.row('history').append(this.Case.id)
                    }).run($.conn).then((res2) => {
                        global.lastCase = this.Case.id;
                        if (this.isNew && this.Case.expires && this.Case.action === 'tban') {
                            $.set('active-cases', this.id, this.Case).then(res3 => {
                                resolve([res, res2, res3]);
                            }).catch(e => {
                                reject(e);
                            });
                        } else resolve([res, res2]);
                    }).catch((e) => {
                        reject(e);
                    });
                } else {
                    // Create a new user object
                    $.set('users', this.Case.offender, {
                      history: [this.Case.id],
                    }).then(res2 => {
                        if (this.isNew && this.Case.expires && this.Case.action === 'tban') {
                            $.set('active-cases', this.id, this.Case).then(res3 => {
                                resolve([res, res2, res3]);
                            }).catch(e => {
                                reject(e);
                            });
                        } else resolve([res, res2]);
                    }).catch((e) => {
                        reject(e);
                    });
                }
            }).catch((err) => {
                reject(err);
            });
        })
    }
    async edit(moderator, newReason) {
        // edit the case reason and edit the history array
        /* HISTORY ARRAY
        {
            moderator: '000000',
            timestamp: 000000 [unix timestamp],
            oldReason: '',
        }
        */
       // history always exists for a case (as blank array)
       return new Promise((resolve, reject) => {
           let updTable = {
                moderator: moderator, // moderator id
                newReason: newReason,
                oldReason: this.Case.reason,
                timestamp: Math.floor(Date.now() / 1000),
            }
           $.query().table('cases').get(this.id).update({
               history: r.row('history').append(updTable),
               reason: newReason
           }).run($.conn).then((res) => {
               this.Case.reason = newReason;
               this.Case.history.unshift(updTable);
               resolve(res);
           }).catch((e) => {
                reject(e);
           })
         });
    }
    async delete() { // no way to delete a case for now lol
        
    }
}


module.exports = {
    DiscordCase
}
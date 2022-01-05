const {Command} = require('discord.js-commando');
const {MessageEmbed, Collection} = require('discord.js');
const noblox = require('noblox.js');
const axios = require('axios');
async function roverApi(message) {return axios.get('https://verify.eryn.io/api/user/' + message.author.id);}
async function bloxlinkApi(message) {return axios.get('https://api.blox.link/v1/user/' + message.author.id);}
async function externalAPI(message) {
    return new Promise(async (resolve, reject) => {
        // Return possible results for each API
        let bloxlinkResult = await bloxlinkApi(message).catch(() => {});
        let roverResult = await roverApi(message).catch(() => {})
        if (roverResult && !(roverResult instanceof Error)) {
            if (roverResult.status === 200) {
                if (roverResult.data.status !== 'error') {
                    resolve([roverResult.data, 'RoVer'])
                }
            }
        }
        if (bloxlinkResult && !(bloxlinkResult instanceof Error)) {
            if (bloxlinkResult.status === 200) {
                if (bloxlinkResult.data.status !== 'error') {
                    resolve([bloxlinkResult.data, 'Bloxlink'])
                }
            }
        }
        resolve(false);
    });
}
async function backendVerify(user, robloxId, robloxName) {
    return new Promise(async (resolve, reject) => {
        $.setupdate('users', user, {
            robloxName: robloxName,
            robloxId: robloxId,
        }, 'roblox-verification').then(() => {
            $.prependIf('history', user, 'pastUsers', {
                robloxName: robloxName,
                robloxId: robloxId,
            }, 'roblox-verification').catch(() => {});
            resolve();
        }).catch(reject);
    });
}
async function verifyById(message, id, isExternal) {
    let desc = await noblox.getPlayerInfo(id).catch(() => { });
    if ((desc instanceof Error)) {
        message.reply('I had an error trying to get your information! Sorry 😢');
        return;
    }
    if (isExternal) {
        backendVerify(message.author.id, id, desc.username).then(async () => {
            await message.reply('You were successfully verified!');
            await message.member.roles.add(settings.roles.verified).catch(() => {
                message.reply('I had an error adding the verified role to you. Sorry :/');
                return;
            })
            message.member.setNickname(desc.username).catch(() => { });
        }).catch(() => {
            message.reply('I had an error! Sorry!');
        });
    } else {

        let code = generateCode();
        const filter = m => m.author.id === message.author.id;
        let embed = new MessageEmbed()
        .setColor(color.blue)
        .setDescription(`\`\`\`${code}\`\`\``)
        .setTitle(`Hey there ${desc.username}, please put this code in your description to verify, and then respond with any message.`);
        await message.channel.send(embed);
        message.channel.awaitMessages(filter, { max: 1, time: 300000, errors: ['time'] }).then(async collected => {
            let response = collected.first().content;
            if (response.toLowerCase() === 'cancel') {
                message.reply('Cancelled.');
                return;
            }
            // get desc
            let desc2 = await noblox.getPlayerInfo(id).catch(() => { });
            if (desc2.blurb.toLowerCase().includes(code.toLowerCase())) {
                // verify
                backendVerify(message.author.id, id, desc.username).then(async () => {
                    await message.reply('You were successfully verified!');
                    await message.member.roles.add(settings.roles.verified).catch(() => {
                        message.reply('I had an error adding the verified role to you. Sorry :/');
                        return;
                    })
                    message.member.setNickname(desc.username).catch(() => { });
                }).catch(() => {
                    message.reply('I had an error! Sorry!');
                });
            } else {
                message.reply('Sorry! I couldn\'t find that code in your description!');
                return;
            }
        }).catch(() => {
            message.reply('You took too long to respond. Please try again.')
        });
    }
}
async function checkVerify(message) {
    let [results, api] = await externalAPI(message).catch(() => {});
    if (results) {
        let userid = api === 'RoVer' ? results.robloxId : results.primaryAccount;
        let robloxName = await noblox.getUsernameFromId(userid).catch(() => {});
        message.reply(`I found that ${robloxName ? `the account \`${robloxName}\`` : `UserId ${userid}`} is linked to ${api}. Do you want to use that account? (\`yes\`/\`no\`)`);
        const filter = m => m.author.id === message.author.id;
        let message2 = await message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] }).catch(() => {
            message.channel.send('You took too long to respond.')
        });
        if (!(message2 instanceof Error)) {
            if (message2.first().content.toLowerCase() === 'cancel') {
                message.reply('Cancelled.');
                return;
            }
            let msgResponse = message2.first().content;
            if (msgResponse.toLowerCase() === 'yes') {
                return userid;
            } else {
                return;
            }
        } else {
            return;
        }
    } else {
        return;
    }
}
// call this AFTER you check with checkVerify
async function promptUser2(message) {
    const filter = m => m.author.id === message.author.id;
    let msg = await message.reply('Alright, let\'s get started. What\'s your Roblox username or ID?');
    
    message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] }).then(async collected => {
        let msgResponse = collected.first().content;
        if (msgResponse.toLowerCase() === 'cancel') {
            message.reply('Cancelled.');
            return;
        }
        let id = Number(msgResponse);
        if (id) {
            // Verify by userid (but ask first)
            message.reply('Is that your username or user ID? (`username`/`id`)').then(async msg => {
                const filter = m => m.author.id === message.author.id;
                await message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] }).then(async collected => {
                    let msgResponse = collected.first().content;
                    if (msgResponse.toLowerCase() === 'cancel') {
                        message.reply('Cancelled.');
                        return;
                    }
                    if (msgResponse.toLowerCase() === 'username') {
                        let userid = await noblox.getIdFromUsername(msgResponse);
                        if (userid) {
                            verifyById(message, userid);
                        } else {
                            message.reply('Sorry! I couldn\'t find your user information.');
                            return;
                        }
                    } else if (msgResponse.toLowerCase() === 'id') {
                        verifyById(message, id);
                    } else {
                        message.reply('I didn\'t understand that. Please try again.');
                        return;
                    }
                }).catch(err => {
                    message.reply('We\'ll just go with your username then.');
                    // get id from name then verifyById()
                });
            });
        } else {
            // Verify by username
            let userid = await noblox.getIdFromUsername(msgResponse);
            let username = await noblox.getUsernameFromId(userid);
            if (userid) {
                verifyById(message, userid);
            } else {
                message.reply('Sorry! I couldn\'t find your user information.');
                return;
            }
        }     
    }).catch(err => {
        msg.reply('You took too long to respond. Please try again.')
    });
}
async function promptUser(message) {
    let doExternal = await checkVerify(message);
    if (doExternal) {
        verifyById(message, doExternal, true);
    } else promptUser2(message);
}
module.exports = class VerifyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'verify',
            memberName: 'verify',
            description: 'Verifies a Roblox account.',
            group: 'util',
            examples: ['verify'],
            guildOnly: true,
            throttling: {
                usages: 99,//1,
                duration: 10
            }
        });
    }
    hasPermission(msg) {
        return PermissionManager.isDiscord(msg);
    }
    async run(message) {
        const filter = m => m.author.id === message.author.id;
        let verifiedUser = await $.get('users', message.author.id, 'roblox-verification').catch(() => {
            message.reply('Sorry! An error occurred. Please try again later.');
            return;
        })
        if (verifiedUser) {
            message.reply(`You're already verified as \`${verifiedUser.robloxName}\`! Do you want to update your information or change your account? (\`yes\`/\`no\`)`);
            message.channel.awaitMessages(filter, {max: 1, time: 30000, errors: ['time']}).then(async collected => {
                let msg = collected.first();
                let c = msg.content.toLowerCase();
                if (c === 'cancel') {
                    message.reply('Cancelled.');
                    return;
                }
                if (c === 'yes' || c == 'y') {
                    this.determineChanges(message);
                } else msg.reply('Alright, I\'ll keep your account as it is.');
            }).catch(() => {
                message.reply('You took too long to respond. Cancelled.');
            });
        } else {
            promptUser(message);
        }
    };
    determineChanges(message) {
        const filter = m => m.author.id === message.author.id;
        message.reply('Would you like to update your information or change your account? Say \`update\` to update your information or \`change\` to change your account.');
        message.channel.awaitMessages(filter, {max: 1, time: 30000, errors: ['time']}).then(async collected => {
            let msg = collected.first();
            let c = msg.content.toLowerCase();
            if (c === 'cancel') {
                message.reply('Cancelled.');
                return;
            }
            if (c === 'update' || c === 'u' || c === 'update my account') {
                // Query Roblox for the user's username and change if necessary
                $.get('users', message.author.id, 'roblox-verification').then(async verifiedUser => {
                    let name = await noblox.getUsernameFromId(verifiedUser.robloxId);
                    if (name !== verifiedUser.robloxName) {
                        verifiedUser.robloxName = name;
                        $.update('users', message.author.id, verifiedUser, 'roblox-verification').catch(() => {});
                        message.reply(`Your account username has been updated to \`${name}\`.`);
                        return;
                    } else {
                        message.reply('Your account is already up to date - contact an Admin if this is an issue.');
                        return;
                    }
                }).catch(() => {
                    message.reply('Sorry! An error occurred. Please try again later.');
                    return;
                });
            }
            else if (c === 'change' || c === 'c' || c === 'change my account') {
                promptUser(message, true); // Add true because they're changing their account
            }
            else message.reply('I didn\'t understand that. Cancelled.');
        }).catch(()=> {
            message.reply('You took too long to respond. Cancelled.');
            return;
        });
    }
}
function generateCode() {
    let code = [
        "cat",
        "dog",
        "wolf",
        "bark",
        "meow",
        "server",
        "security",
        "essentials",
        "developer",
        "development",
        "island",
        "lost",
        "roblox",
        "visual",
        "code",
        "api",
        "bot",
        "moon",
        "sun",
        "tree",
        "soda",
        "gamer",
        "fun",
        "yes",
        "no",
        "general",
        "time",
        "manager",
        "commander",
        "cool",
        "red",
        "blue",
        "yellow",
        "lavender",
        "pink",
        "colors",
        "magenta",
        "cyan",
        "teal",
        "orange",
        "purple",
        "gray",
        "dark",
        "light",
    ]
    let finishedCode = [];
    // pick a random code and join it
    for (let i = 0; i < 15; i++) {
        let index = Math.floor(Math.random() * code.length);
        finishedCode.push(code[index]);
    }
    return finishedCode.join(' ');
}
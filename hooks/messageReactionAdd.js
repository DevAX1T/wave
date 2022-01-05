function getEmoji(reaction) {
    if (reaction.emoji.animated) {
        return `<a:${reaction.emoji.name}:${reaction.emoji.id}>`;
    } else {
        // check if it's a default emoji
        if (!reaction.emoji.id) {
            if (reaction.emoji.name === '🆔') return;
            return reaction.emoji.name;
        } else {
            return `<:${reaction.emoji.name}:${reaction.emoji.id}>`;
        }
    }
}
function promiseReactionRoles(reaction, user, client) {
    return new Promise((resolve, reject) => {
        $.get('reaction-roles', reaction.message.id).then(data => {
            resolve(data);
        }).catch(err => {
            reject(err);
        });
    });
}
function processReactionRoles(reaction, user, client) {
    let member = reaction.message.guild.members.cache.get(user.id);
    if (!member) return;
    promiseReactionRoles(reaction, user, client).then(async (data) => {
        if (data) {
            let reactionFound = data[getEmoji(reaction)];
            if (reactionFound) {
                let hasRole = member.roles.cache.has(reactionFound.role);
                if (!hasRole) {
                    member.roles.add(reactionFound.role).then(() => {
                        member.send(`Lost Islands - I gave you the \`${reactionFound.message}\` role!`)
                    }).catch(() => {
                        member.send(`Lost Islands - I failed to give you the \`${reactionFound.message}\` role. Sorry :()`)
                    })
                }
            }
        }
    }).catch(err => {
        return;
    })
}
module.exports = {
    event: 'messageReactionAdd',
    // external: true, // if true, the event will be called in external servers
    try: async function(reaction, user, client) {
        if (user.bot) return;
        if (reaction.partial) {
            try {
                await reaction.fetch();
                await reaction.message.fetch();
            } catch {
                return;
            }
        }
        processReactionRoles(reaction, user, client);
    }
}
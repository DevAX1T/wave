module.exports = {
    sec: 10, // seconds
    run: async (client, t) => {
        $.get('active-cases').then(cases => {
            cases.forEach(async (c) => {
                if (Math.floor(Date.now() / 1000) > c.expires) {
                    // Unban the user from the guild
                    let guild = client.guilds.cache.get(settings.guild);
                    if (c.action === 'tban') {
                        let isBanned;
                        await guild.fetchBans().then(bans => {
                            isBanned = bans.has(c.offender);
                        });
                        if (isBanned) {
                            guild.members.unban(c.offender, 'Expiration');
                            let Case = CaseManager.Case({
                                moderator: c.moderator,
                                offender: c.offender,
                                reason: 'Expired',
                                action: 'unban',
                                createdAt: Math.floor(Date.now() / 1000),
                            });
                            Case.submit().then(() => {
                                $.clear('active-cases', c.id).catch(() => {});
                            }).catch(() => {});
                        }
                    }
                    // unban the user from the guild
                }
            });
        }).catch(() => {});
    }
}
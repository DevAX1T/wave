module.exports = {
    sec: 10, // seconds
    run: (client, t) => {
        let channels = $.get('locked-channels').then(channels => {
            channels.forEach(lockedChannel => {
                if (lockedChannel.expires) {
                    if (lockedChannel.expires < Math.floor(Date.now() / 1000)) {
                        // Unlock the channel
                        client.channels.cache.get(lockedChannel.id).updateOverwrite(lockedChannel.guild, {SEND_MESSAGES: true}).then(() => {
                            $.clear('locked-channels', lockedChannel.id).then(() => {
                                client.channels.cache.get(lockedChannel.id).send(`🔓 This channel is now unlocked.`);
                            })
                        })
                    }
                }
            });
        });
    }
}
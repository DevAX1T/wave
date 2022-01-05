module.exports = {
    event: 'commandError',
    // external: true, // if true, the event will be called in external servers
    try: async function(cmd, err) {
        ErrorManager.create(err, 'command', cmd)
    }
}
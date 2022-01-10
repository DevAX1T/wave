module.exports = {
    event: 'commandError',
    try: async function(cmd, err) {
        ErrorManager.create(err, 'command', cmd)
    }
}
module.exports = {
    event: 'error',
    // external: true, // if true, the event will be called in external servers
    try: async function(err) {
        ErrorManager.create(err, 'client')
    }
}
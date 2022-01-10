module.exports = {
    event: 'error',
    try: function(err) {
        ErrorManager.create(err, 'client')
    }
}
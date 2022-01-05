module.exports = {
    path: '/channels/:lol',
    api: true,
    method: 'get',
    callback: function (req, res) {
        // requests data from the bot
        console.log('ye')
        res.status(200).send(JSON.stringify({
            status: 'OK',
            response: req.params.lol
        }));
    }
}
function getUser(id) {
    return new Promise ( (resolve, reject) => {
        r.db('roblox-verification').table('users').get(id).run(conn)
        .then( (result) => {
            resolve(result);
        }).catch( (err) => {
            reject(err); 
        });
    });
}
module.exports = {
    path: '/webhook', // subdomain.domain.xyz/webhook
    api: true,
    method: 'get',
    contentType: 'application/json',
    callback: async function (req, res) {
        // get the query
        // get the request body
        if (req.body) {
            res.status(200).send(JSON.stringify(req.body))
            console.log('a')
        } else {
            console.log('bad')
            res.status(400).send('No data provided');
        }
        console.log(req.body)
    }
}
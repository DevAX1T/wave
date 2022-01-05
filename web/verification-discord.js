const { DatabaseManager } = require("../util/ManagerClient");

function getUser(id) {
    let r = DatabaseManager.q()
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
    path: '/verification/discord/:id',
    api: true,
    method: 'get',
    callback: async function (req, res) {
        // requests data from the bot
        // if not params id return
        let user = req.params.id;
        if (!user) {
            res.status(400).send(JSON.stringify({
                error: 'No user id provided'
            }));
            return;
        } else {
            let result = await getUser(user).catch( (err) => {
                console.log('ret '+err);
                res.status(500).send(JSON.stringify({error:'lol'}));
                return;
            });
            console.log(result)
            if (result) {
                console.log('response result')
            } else {
                console.log('no result')
            }
            //res.status(200).send(JSON.stringify({
              //  status: 'OK',
              //  response: req.params.id
            //}));
        }
        
    }
}
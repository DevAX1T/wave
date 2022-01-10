const {DiscordCase} = require('../Objects');

class CaseManager {
    constructor(client) {
        this.client = client;
    }
    Case(options) {
        // check if options is a string
        if (typeof options === 'string') {
            // Return a case object from the database
            return new Promise((resolve, reject) => {
                $.get('cases', options).then(Case => {
                    resolve(new DiscordCase(Case));
                }).catch(reject);
            });
        } else {
            return new DiscordCase(options);
        }
    }
    async Cases(userid) {
        // Get user cases and return tables of them
        return new Promise((resolve, reject) => {
            $.get('users', userid).then(user => {
                if (!user) {
                    resolve([]); // Resolve with a blank array if the user doesn't exist
                    return;
                }
                $.query().table('cases').getAll(...(user.history)).run($.conn).then(cursor => {
                    cursor.toArray().then(cases => {
                        resolve(cases.map(Case => new DiscordCase(Case)));
                    }).catch(reject);
                }).catch(reject);
            }).catch(reject)
        });
    }
}
module.exports = CaseManager;
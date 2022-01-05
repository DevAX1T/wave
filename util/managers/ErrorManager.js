// get uuid module
var uuid = require('uuid/v4');
// generate a new uuid
function log(...args) {
    if (isWindows) {
        console.log(...args);
    }   
}
class ErrorManager {
    async get(id) {
        let m = DatabaseManager
        let r = m.r
        if (id === '*') {
            // get all errors
            // Create a new promise that gets all errors and awaits a response
            function getErrors() {
                return new Promise ((resolve, reject) => {
                    m.query().table('errors').run(m.conn).then(cursor => {
                        return cursor.toArray();
                    }).then(result => {
                        resolve(result);
                    }).catch(err => {
                        reject(err);
                    })
                });
            }
            return getErrors();
        } else {
            function getError() {
                return new Promise( (resolve, reject) => {
                   m.query().table('errors').get(id).run(m.conn).then(result => {
                       resolve(result)
                   }).catch(err => {
                       log('ErrorManager get: '+err.message);
                   });
                });
            }
            return getError();
        }
    }
    async create(err, type, command) {
        if (!err.stack) return;
        let m = DatabaseManager
        let r = m.r
        // command is only if type is command
        let id = uuid();
        let unix = Math.floor(Date.now() / 1000);
        m.query().table('errors').insert({
            id: id,
            type: type,
            error: err.stack,
            created: unix,
            command:  command ? command.name : null
        }).run(m.conn, function(err2, result) {
            if (err2) {
                log(`ErrorManager create: error failed to save; ${type}; ${command ? command.name : err2}`);
                return;
            }
            log(`ErrorManager: created new error ${id} ${
                isWindows ? `\n${err.stack}` : ''
            }`)
        });
    }
}
module.exports = ErrorManager;
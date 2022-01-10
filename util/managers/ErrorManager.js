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
        if (id === '*') {
            // get all errors
            // Create a new promise that gets all errors and awaits a response
            function getErrors() {
                return new Promise ((resolve, reject) => {
                    m.query().table('errors').run(m.conn).then(async cursor => {
                        resolve(await cursor.toArray())
                    }).catch(reject)
                });
            }
            return getErrors();
        } else {
            function getError() {
                return new Promise( (resolve, reject) => {
                   m.query().table('errors').get(id).run(m.conn).then(resolve).catch(err => {
                       log('ErrorManager get: '+err.message);
                       reject(err);
                   });
                });
            }
            return getError();
        }
    }
    async create(err, type, command) {
        if (!err.stack) return;
        let unix = Math.floor(Date.now() / 1000);
        $.set('errors', uuid(), {
            type: type,
            command: command,
            error: err.stack,
            unix: unix
        }).then(() => {
            log(`ErrorManager: Created new error ${id} \n${err.stack}`);
        }).catch(saveError => {
            log(`ErrorManager Create: Error failed to save; Type ${type}; ${command ? command.name : saveError} ||||| STACK ${err.stack}`);
        })
        // m.query().table('errors').insert({
        //     id: id,
        //     type: type,
        //     error: err.stack,
        //     created: unix,
        //     command:  command ? command.name : null
        // }).run(m.conn, function(err2, result) {
        //     if (err2) {
        //         log(`ErrorManager create: error failed to save; ${type}; ${command ? command.name : err2}`);
        //         return;
        //     }
        //     log(`ErrorManager: created new error ${id} ${
        //         isWindows ? `\n${err.stack}` : ''
        //     }`)
        // });
    }
}
module.exports = ErrorManager;
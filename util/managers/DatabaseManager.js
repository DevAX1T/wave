let r = require('rethinkdb');
class DatabaseManager {
    constructor({host, port, password, name}) {
        // set up a rethinkdb connection
        if (!host || !port || !password || !name) {
            output('red', 'DatabaseManager', 'Missing database config');
        }
        this.config = {
            host: host,
            port: port,
            password: password,
        }
        this.name = name;
        this.reconnecting = false;
        global.$ = this;
    }
    async connect() {
        return new Promise((resolve, reject) => {
            r.connect(this.config).then(conn => {
                this.conn = conn;
                this.r = r;
                resolve(conn);
                output('blue', 'DatabaseManager', this.reconnecting ? 'Reconnected to RethinkDB' : 'Connected to RethinkDB')
                conn.addListener('close', () => {
                    if (!this.reconnecting) {
                        output('red', 'DatabaseManager', 'Connection to RethinkDB was closed');
                        this.reconnecting = true;
                        this.connect().then(() => {
                            this.reconnecting = false
                        }).catch(() => {
                            output('red', 'DatabaseManager', 'Failed to reconnect to RethinkDB');
                            process.exit(); // Just restart the bot if we fail to reconnect
                        })
                    }
                });
            }).catch(reject);
        });
    }
    async botSettings() {
        // return all bot settings (array form)
        let dbSettings = await new Promise((resolve, reject) => {
            r.db(this.name).table('settings').run(this.conn).then(async cursor => {
                resolve(await cursor.toArray());
            }).catch(err => {
                output('red', 'DatabaseManager', 'Failed to get bot settings; ' + err);
                reject(err);
            });
        });
        let botSettings = {};
        dbSettings.forEach(setting => {
            botSettings[setting.id] = setting.value;
        });
        return botSettings;
    }
    async get(table, id, db) {
        return new Promise((resolve, reject) => {
            let query = r.db(db || this.name).table(table);
            let qget = id ? true : false;
            if (id) {
                query = query.get(id);
            }
            query.run(this.conn).then(result => {
                resolve(qget ? result : result.toArray());
            }).catch(reject);
        });
    }
    /**
     * Removes a document from the specified table.
     * @param {string} table 
     * @param {string} id 
     * @param {string} db 
     * @returns 
     */
    async clear(table, id, db) {
        return new Promise((resolve, reject) => {
            let query = r.db(db || this.name).table(table);
            query.get(id).delete().run(this.conn).then(resolve).catch(reject);
        });
    }
    /**
     * Removes a document from the specified table; OR deletes all documents from a table.
     * @param {string} table 
     * @param {string} id 
     * @param {string} db 
     * @returns 
     */
    async fclear(table, id, db) {
        return new Promise((resolve, reject) => {
            let query = r.db(db || this.name).table(table);
            if (id) {
                query = query.get(id);
            }
            query.delete().run(this.conn).then(result => {
                resolve(result);
            }).catch(err => {
                reject(err);
            });
        })
    }
    set(table, id, data, db) {
        return new Promise((resolve, reject) => {
            data.id = id;
            r.db(db || this.name).table(table).insert(data).run(this.conn).then(resolve).catch(reject);
        });
    }
    setupdate(table, id, data, db) {
        return new Promise((resolve, reject) => {
            let query = r.db(db || this.name).table(table);
            data.id = id;
            let query2 = query.get(id);
            query2.run(this.conn).then(result => {
                if (result) {
                    query2.update(data).run(this.conn).then(resolve).catch(reject);
                } else {
                    query.insert(data).run(this.conn).then(resolve).catch(reject);
                }
            }).catch(reject);
        })
    }
    prependIf(table, id, field, data, db) {
        return new Promise((resolve, reject) => {
            let query = r.db(db || this.name).table(table);
            let query2 = query.get(id);
            query2.run(this.conn).then(result => {
                if (result) {
                    // It exists, so prepend with r
                    query2.update({
                        [field]: r.row(field).default([]).prepend(data)
                    }).run(this.conn).then(resolve).catch(reject);
                } else {
                    // It doesn't exist, so insert
                    let newData = {
                        id: id,
                        [field]: [data]
                    }
                    query.insert(newData).run(this.conn).then(resolve).catch(reject);
                }
            }).catch(reject);
        })
    }
    update(table, id, data, db) {
        return new Promise((resolve, reject) => {
            let query = r.db(db || this.name).table(table)
            if (id) {
                query = query.get(id)
            }
            query.update(data).run(this.conn).then(resolve).catch(reject);
        });
    }
    query() { // Really just a shortcut
        return r.db(this.name)
    }
    q() {return r}
}
module.exports = DatabaseManager;
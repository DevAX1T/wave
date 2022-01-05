// set a global variable
r = require('rethinkdb');
const path = require('path');
const dotenv = require('dotenv');
const Commando = require('discord.js-commando');

// Require OUR modules
let {PermissionManager, ErrorManager, WebManager, DatabaseManager, HookManager, IntervalManager, GlobalManager, CaseManager} = require('./util/ManagerClient.js');
dotenv.config();
// set some global variables
let [settings, isWindows] = [{}, process.platform == 'win32'];
GlobalManager = new GlobalManager([
    path.join(__dirname, 'util', 'emojis'),
    path.join(__dirname, 'util', 'colors'),
]);
PermissionManager = new PermissionManager();
ErrorManager = new ErrorManager();
// WebManager = new WebManager({
//     port: parseInt(process.env.webPort),
//     registerIn: path.join(__dirname, 'web')
// });
DatabaseManager = new DatabaseManager({
    host: process.env.primary_db_host,
    port: parseInt(process.env.primary_db_port),
    password: process.env.primary_db_password,
    name: process.env.primary_db_name + (isWindows ? '-testing' : ''),

});

async function start() {
    await DatabaseManager.connect();
    settings = await DatabaseManager.botSettings();
    global.settings = settings;
    global.isWindows = isWindows;
    global.PermissionManager = PermissionManager;
    global.ErrorManager = ErrorManager;
    global.DatabaseManager = DatabaseManager;
    // await WebManager.registerAuth({
    //     id: 'API-Bearer',
    //     type: 'Bearer',
    //     validate: (token, req, res) => {
    //         let split = token.split(' ')
    //         return (split[0] == 'Bearer' && split[1] == settings.apiToken);
    //     }
    // })
    // await WebManager.search();
    // now we can FINALLY start the client
    const client = new Commando.Client({
        owner: settings.owners,
        commandPrefix: isWindows ? settings.prefix.testing : settings.prefix.production,
        unknownCommandResponse: false,
        partials: ['REACTION', 'CHANNEL', 'MESSAGE']
    });
    client.registry
    .registerGroups(settings.groups)
    .registerDefaultTypes()
    .registerTypesIn(path.join(__dirname, 'types'))
    .registerDefaultGroups()
    .registerDefaultCommands({
        prefix: false,
        unknownCommand: false,
        commandState: false
    })
    .registerCommandsIn(path.join(__dirname, 'commands'));
    // Log into the client
    client.login(isWindows ? settings.token.testing : settings.token.production);
    new HookManager(client, path.join(__dirname, 'hooks'));
    new IntervalManager(path.join(__dirname, 'intervals'), client);
    new WebManager(client);
    global.CaseManager = new CaseManager(client);
    global.pending = {};
    global.$client = client;
}

process.on('uncaughtException', (err) => {
    ErrorManager.create(err, 'runtime')
})

start(); // Finally start the bot :D
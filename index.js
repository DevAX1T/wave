// set a global variable
r = require('rethinkdb');
const path = require('path');
const dotenv = require('dotenv');
const Commando = require('discord.js-commando');

// Require OUR modules
let {PermissionManager, ErrorManager, DatabaseManager, HookManager, IntervalManager, GlobalManager, CaseManager} = require('./util/ManagerClient.js');
dotenv.config();
// set some global variables
let [settings, isWindows] = [{}, process.platform == 'win32'];
GlobalManager = new GlobalManager([
    path.join(__dirname, 'util', 'emojis'),
    path.join(__dirname, 'util', 'colors'),
]);
PermissionManager = new PermissionManager();
ErrorManager = new ErrorManager();
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
    await client.login(isWindows ? settings.token.testing : settings.token.production);
    new HookManager(client, path.join(__dirname, 'hooks'));
    new IntervalManager(path.join(__dirname, 'intervals'), client);
    global.CaseManager = new CaseManager(client);
    global.pending = {};
    global.$client = client;
}

process.on('uncaughtException', (err) => {
    console.error(err);
    try {
        ErrorManager.create(err, 'runtime')
    } catch {
        // do nothing
    }
})

start(); // Finally start the bot :D
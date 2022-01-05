const DatabaseManager = require('./managers/DatabaseManager.js');
const SearchManager = require('./managers/SearchManager.js');
const ErrorManager = require('./managers/ErrorManager.js');
const PermissionManager = require('./managers/PermissionManager.js');
const WebManager = require('./managers/WebManager.js');
const IntervalManager = require('./managers/IntervalManager.js');
const HookManager = require('./managers/HookManager.js');
const GlobalManager = require('./managers/GlobalManager.js');
const CaseManager = require('./managers/CaseManager.js');
const Objects = require('./Objects.js');
// export all managers
module.exports = {
    DatabaseManager,
    SearchManager,
    ErrorManager,
    PermissionManager,
    WebManager,
    IntervalManager,
    HookManager,
    GlobalManager,
    CaseManager,
    Objects
}
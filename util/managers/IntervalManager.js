const SearchManager = require('./SearchManager');
class IntervalManager {
    constructor(registerIn, client) {
        new SearchManager().search(registerIn, async interval => {
            interval = await require(interval)
            let set = setInterval(() => {
                interval.run(client, set);  
            }, interval.sec * 1000);
        });
    }
}
module.exports = IntervalManager;
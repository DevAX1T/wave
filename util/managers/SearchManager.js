const fs = require('fs');
const path = require('path');
class SearchManager {
    search(directory, fn) {
        fs.readdirSync(directory).forEach(async file => {
            const stat = fs.statSync(path.join(directory, file));
            if (stat.isFile()) {
                fn(path.join(directory, file));
            } else if (stat.isDirectory()) {
                this.search(path.join(directory, file), fn);
            }
        });
    }
}
module.exports = SearchManager;
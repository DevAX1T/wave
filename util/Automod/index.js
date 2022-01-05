module.exports = {
    search: (client) => {
        const fs = require('fs');
        const path = require('path');
        function scan(dir, event) {
            fs.readdirSync(dir).forEach(file => {
                let joined = path.join(dir, file);
                const stat = fs.statSync(joined);
                if (stat.isDirectory()) {
                    scan(joined, file);
                } else if (stat.isFile()) {
                    let _file = require(joined);
                    client.on(event, (...args) => _file(...args, client));
                }
            })
        }
        scan(path.join(__dirname, 'events'))
    }
}
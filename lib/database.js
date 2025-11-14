module.exports = class Database {
    constructor() {
        this.tables = {};
        this.timeoutIdentifiers = [];
        process.on("beforeexit", (code) => {
            this.timeoutIdentifiers.forEach((element) => {
                clearTimeout(element);
            });
        });
    }

    createTable(name) {
        Object.assign(this.tables, {name: new Map()});
    }

    setResource(tableID, key, value) {
        this.tables[tableID].set(key, value);
    }

    setCachedResource(tableID, key, value, ttl) {
        this.tables[tableID].set(key, value);
        this.timeoutIdentifiers.push(setTimeout(() => {
            this.tables[tableID].delete(key);
        }, ttl));
    }

    getResource(tableID, key) {
        this.tables[tableID].get(key);
    }

    getTableSize(tableID) {
        this.tables[tableID].size();
    }

    deleteResource(tableID, key) {
        this.tables[tableID].delete(key);
    }
}
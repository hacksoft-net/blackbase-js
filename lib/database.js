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
        Object.assign(this.tables, { [name]: new Map() });
    }

    setResource(tableID, key, value) {
        if (this.tables[tableID]) {
            this.tables[tableID].set(key, value);
        }
    }

    setCachedResource(tableID, key, value, ttl) {
        if (this.tables[tableID]) {
            this.tables[tableID].set(key, value);
            this.timeoutIdentifiers.push(setTimeout(() => {
                this.tables[tableID].delete(key);
            }, ttl));
        } else {

        }
    }

    getResource(tableID, key, defaultIfNotFound = 0) {
        return this.tables[tableID].get(key);
    }

    getTableSize(tableID) {
        return this.tables[tableID].size();
    }

    deleteResource(tableID, key) {
        if (this.tables[tableID].get(key)) {
            this.tables[tableID].delete(key);
        }
    }
}
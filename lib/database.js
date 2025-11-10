module.exports = class Database {
    constructor() {
        this.tables = {};
    }

    createTable(name) {
        Object.assign(this.tables, {name: new Map()});
    }

    setResource(tableID, key, value) {
        this.tables[tableID].set(key, value);
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
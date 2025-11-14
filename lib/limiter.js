const Database = require("./database.js");
const { BlackbaseTimeMinutes } = require("./time.js");
const IPDB = () => {
    const IPDatabase = new Database();
    IPDatabase.createTable("internetProtocolAddresses");
    return IPDatabase;
}
const IPAddRequest = (db, address) => {
    if (db.getResource("internetProtocolAddresses", address) > 10) {
        return false
    } else {
        db.setCachedResource("internetProtocolAddresses", address, db.getResource("internetProtocolAddresses", address) + 1, BlackbaseTimeMinutes(3));
        return true
    }
}

module.exports = {IPDB, IPAddRequest}
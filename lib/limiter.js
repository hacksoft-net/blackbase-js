const Database = require("./database.js");
const { BlackbaseTimeSeconds } = require("./time.js");
const IPDB = () => {
    const IPDatabase = new Database();
    IPDatabase.createTable("internetProtocolAddresses");
    return IPDatabase;
}
const IPAddRequest = (db, address, maxRequests, ttl = BlackbaseTimeSeconds(20)) => {
    if (db.getResource("internetProtocolAddresses", address) > maxRequests) {
        return false
    } else {
        if (db.getResource("internetProtocolAddresses", address) == undefined) {
            db.setCachedResource("internetProtocolAddresses", address, 0, ttl);
        } else {
            db.setCachedResource("internetProtocolAddresses", address, db.getResource("internetProtocolAddresses", address) + 1, ttl);
        }
        return true
    }
}

module.exports = { IPDB, IPAddRequest }
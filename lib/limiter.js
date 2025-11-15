const Database = require("./database.js");
const { BlackbaseTimeSeconds } = require("./time.js");
const IPDB = () => {
    const IPDatabase = new Database();
    IPDatabase.createTable("internetProtocolAddresses");
    return IPDatabase;
}
const IPAddRequest = (db, address, maxRequests, ttl = BlackbaseTimeSeconds(20)) => {
    if (db.getResource("internetProtocolAddresses", address) > maxRequests) {
        console.log("DB");
        return false
    } else {
        if (db.getResource("internetProtocolAddresses", address) == undefined) {
            console.log(address);
            console.log("Processing");
            db.setCachedResource("internetProtocolAddresses", address, 0, ttl);
            console.log("L: "+db.getResource("internetProtocolAddresses", address));
        } else {
            db.setCachedResource("internetProtocolAddresses", address, db.getResource("internetProtocolAddresses", address) + 1, ttl);
            console.log(db.getResource("internetProtocolAddresses", address) + 1);
        }
        return true
    }
}

module.exports = { IPDB, IPAddRequest }
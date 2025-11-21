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
const IPParseMap = (map, path) => {
    console.log(map);
    if (map.get("*")) { // Wildcard
        return map.get("*")
    } else if (map.get(path)) {
        return map.get(path);
    }
}

module.exports = { IPDB, IPAddRequest, IPParseMap }
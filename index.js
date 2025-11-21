const http = require("http");
const https = require("https");
const querystring = require('querystring');
const Router = require("find-my-way")();
const Database = require("./lib/database.js");
const Limiter = require("./lib/limiter.js");
const TimeHelpers = require("./lib/time.js");
const BTSeconds = TimeHelpers.BlackbaseTimeSeconds;
const BTMinutes = TimeHelpers.BlackbaseTimeMinutes;
const BTHours = TimeHelpers.BlackbaseTimeHours;
const BTDays = TimeHelpers.BlackbaseTimeDays;

let informationDatabase = new Database();
let limiter = Limiter.IPDB();
let globalPassword;

const bodyParse = async (req) => {
    return new Promise((resolve, reject) => {
        let data = "";
        req.on('data', (stream) => {
            data += stream;
        });

        req.on('error', () => {
            reject("Something happened.");
        })

        req.on('end', () => {
            resolve(data);
        });
    });
}

Router.on('GET', '/health', (req, res) => {
    if (informationDatabase) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(`{
            "status": "Active",
            "details": "Database/Map Working"
        }`);
    } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(`{
            "status": "Active",
            "details": "Database/Map Not Working"
        }`);
    }
});

Router.on('POST', '/create-table', async (req, res) => {
    const body = await bodyParse(req);
    const jsonData = querystring.parse(body);
    if (jsonData.password == globalPassword) {
        informationDatabase.createTable(jsonData.name);
        res.writeHead(201, { 'Content-Type': 'text/plain' });
        res.end('Created');
    } else {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Forbidden');
    }
});

Router.on('POST', '/set-resource', async (req, res) => {
    const body = await bodyParse(req);
    const jsonData = querystring.parse(body);
    if (jsonData.password == globalPassword) {
        informationDatabase.setResource(jsonData.tableID, jsonData.key, jsonData.value);
        res.writeHead(201, { 'Content-Type': 'text/plain' });
        res.end('Created');
    } else {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Forbidden');
    }
});

Router.on('POST', '/set-cached-resource', async (req, res) => {
    const body = await bodyParse(req);
    const jsonData = querystring.parse(body);
    if (jsonData.password == globalPassword) {
        informationDatabase.setCachedResource(jsonData.tableID, jsonData.key, jsonData.value, jsonData.ttl);
        res.writeHead(201, { 'Content-Type': 'text/plain' });
        res.end('Created');
    } else {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Forbidden');
    }
});

Router.on('POST', '/get-resource', async (req, res) => {
    const body = await bodyParse(req);
    const jsonData = querystring.parse(body);
    if (jsonData.password == globalPassword) {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(informationDatabase.getResource(jsonData.tableID, jsonData.key));
    } else {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Forbidden');
    }
});

Router.on('POST', '/get-table-size', async (req, res) => {
    const body = await bodyParse(req);
    const jsonData = querystring.parse(body);
    if (jsonData.password == globalPassword) {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(informationDatabase.getTableSize(jsonData.tableID));
    } else {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Forbidden');
    }
});

Router.on('POST', '/delete-resource', async (req, res) => {
    const body = await bodyParse(req);
    const jsonData = querystring.parse(body);
    if (jsonData.password == globalPassword) {
        informationDatabase.deleteResource(jsonData.tableID, jsonData.key);
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Deleted');
    } else {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Forbidden');
    }
});

class HttpBlackBase {
    constructor(password, ipLimitMaps = new Map().set("*", 100), rateLimitMSBeforeRetry = 2400) {
        globalPassword = password;
        this.server = http.createServer((req, res) => {
            let lmr = Limiter.IPAddRequest(limiter, req.socket.remoteAddress, Limiter.IPParseMap(ipLimitMaps), rateLimitMSBeforeRetry);
            if (lmr) {
                Router.lookup(req, res);
            } else {
                res.writeHead(429, {'Content-Type': 'text/plain', 'Retry-After': rateLimitMSBeforeRetry / 100});
                res.end('429 Too Many Requests');
            }
        });

        process.on("beforeexit", function () {
            Router.off('GET', '/health');
            Router.off('POST', '/create-table');
            Router.off('POST', '/set-resource');
            Router.off('POST', '/get-resource');
            Router.off('POST', '/get-table-size');
            Router.off('POST', '/delete-resource');
        });
    }

    listen(port) {
        this.server.listen(port);
    }
}

class HttpsBlackBase {
    constructor(password, options, ipLimitMaps = new Map().set("*", 100), rateLimitMSBeforeRetry = 2400) {
        globalPassword = password;
        this.server = https.createServer(options, (req, res) => {
            let lmr = Limiter.IPAddRequest(limiter, req.socket.remoteAddress, Limiter.IPParseMap(ipLimitMaps), rateLimitMSBeforeRetry);
            if (lmr) {
                Router.lookup(req, res);
            } else {
                res.writeHead(429, {'Content-Type': 'text/plain', 'Retry-After': rateLimitMSBeforeRetry / 100});
                res.end('Wait, you spammed that.');
            }
        });

        process.on("beforeexit", function () {
            Router.off('GET', '/health');
            Router.off('POST', '/create-table');
            Router.off('POST', '/set-resource');
            Router.off('POST', '/get-resource');
            Router.off('POST', '/get-table-size');
            Router.off('POST', '/delete-resource');
        });
    }

    listen(port) {
        this.server.listen(port);
    }
}

module.exports = { HttpBlackBase, HttpsBlackBase, BTSeconds, BTMinutes, BTHours, BTDays }
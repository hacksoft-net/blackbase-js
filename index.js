const http = require("http");
const https = require("https");
const querystring = require('querystring');
const router = require("find-my-way")();
const Database = require("./lib/database.js");
let informationDatabase = new Database();
let internetProtocolAddressed = new Database();
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

router.on('GET', '/health', (req, res) => {
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

router.on('GET', '/cr', async (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
        <form action="/create-table" method="post">
            <label for="password">Password:</label><br>
            <input type="password" id="password" name="password">
            <label for="name">Name:</label><br>
            <input type="text" id="name" name="name">
            <input type="submit" value="Submit">
        </form>
    `)
});

router.on('POST', '/create-table', async (req, res) => {
    const body = await bodyParse(req);
    const jsonData = querystring.parse(body);
    if (jsonData.password == globalPassword) {
        informationDatabase.createTable(jsonData.name);
        res.writeHead(201, { 'Content-Type': 'text/plain' });
        res.end('Created');
        Heapdump.writeSnapshot(function (err, filename) {
            console.log('dump written to', filename);
        });
    } else {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Forbidden');
    }
});

router.on('POST', '/set-resource', async (req, res) => {
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

router.on('POST', '/get-resource', async (req, res) => {
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

router.on('POST', '/get-table-size', async (req, res) => {
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

router.on('POST', '/delete-resource', async (req, res) => {
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
    constructor(password) {
        globalPassword = password;
        this.server = http.createServer((req, res) => {
            router.lookup(req, res);
        });

        process.on("exit", function () {
            router.off('GET', '/health');
            router.off('POST', '/create-table');
            router.off('POST', '/set-resource');
            router.off('POST', '/get-resource');
            router.off('POST', '/get-table-size');
            router.off('POST', '/delete-resource');
        });
    }

    listen(port) {
        this.server.listen(port);
    }
}

class HttpsBlackBase {
    constructor(password, options) {
        globalPassword = password;
        this.server = https.createServer(options, (req, res) => {
            router.lookup(req, res);
        });

        process.on("exit", function () {
            router.off('GET', '/health');
            router.off('POST', '/create-table');
            router.off('POST', '/set-resource');
            router.off('POST', '/get-resource');
            router.off('POST', '/get-table-size');
            router.off('POST', '/delete-resource');
        });
    }

    listen(port) {
        this.server.listen(port);
    }
}

module.exports = { HttpBlackBase, HttpsBlackBase }
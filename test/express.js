const http = require("http");
const database = require("../index.js");
const router = require("find-my-way")();
router.on("GET", "/create-table", (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Form</title>
</head>
<body>
    <form action="http://127.0.0.1:3000/create-table" method="POST">
        <input name="name" placeholder="Name">
        <input name="password" placeholder="Password">
        <button type="submit">Submit</button>
    </form>
</body>
</html>
    `);
});

router.on("GET", "/set-resource", (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Form</title>
</head>
<body>
    <form action="http://127.0.0.1:3000/set-resource" method="POST">
        <input name="tableID" placeholder="Table ID">
        <input name="password" placeholder="Password">
        <input name="key" placeholder="Key">
        <input name="value" placeholder="Value">
        <button type="submit">Submit</button>
    </form>
</body>
</html>
    `);
});

router.on("GET", "/get-resource", (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Form</title>
</head>
<body>
    <form action="http://127.0.0.1:3000/get-resource" method="POST">
        <input name="tableID" placeholder="Table ID">
        <input name="password" placeholder="Password">
        <input name="key" placeholder="Key">
        <button type="submit">Submit</button>
    </form>
</body>
</html>
    `);
});

router.on("GET", "/set-cached-resource", (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Form</title>
</head>
<body>
    <form action="http://127.0.0.1:3000/set-cached-resource" method="POST">
        <input name="tableID" placeholder="Table ID">
        <input name="password" placeholder="Password">
        <input name="key" placeholder="Key">
        <input name="value" placeholder="Value">
        <input name="ttl" placeholder="TTL">
        <button type="submit">Submit</button>
    </form>
</body>
</html>
    `);
});

new database.HttpBlackBase("jupers", new Map().set("*", 1), 8000).listen(3000);

http.createServer((req, res) => {
    router.lookup(req, res);
}).listen(3002);
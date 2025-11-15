# Blackbase
An in-memory store for the cloud.
## What Is Blackbase?
Blackbase is a somewhat proof-of-concept database for volatile, non-persistent data that has practical applications in session data management, among other things.

> ### Note
> While tests in memory usage have proven successful (it doesn't use a lot of memory), be very careful when using this software. It may prove volatile and if that is so, immediately contact us using the metadata in the software's package.json (email). Also version 0.1.0-0.2.0 does not have a rate limiter.
>
>

## Install
```bash
npm install blackbase
```

## Example
This creates a new instance of Blackbase.

```javascript
const Blackbase = require("blackbase");
const Database = new Blackbase.HttpBlackBase("password", 10, 6000)
```

## Breakdown and HttpBlackBase/HttpsBlackBase
First, let's talk about HttpBlackBase. The only arguments in the constructor are the password for accessing the database and then the rate limiter max requests, followed by the value for how long in <b>milliseconds</b> the app should wait before letting a user in again. Then you just add the listen method, which is slightly different because it is simply organized, as shown here: `listen(port)`. HttpsBlackBase is what you would expect, organized like `HttpBlackBase(password, options)`

The following URLs can be used for processing a POST request with "password" in the URL-encoded body:

`/create-table` - This is extremely important, without a table you cannot create a resource. Requires "name" in the body.

`/set-resource` - Adds a key-value pair to the table. Requires "tableID", "key", and "value"

`/set-cached-resource` - Adds a key-value pair to the table with TTL. Requires "tableID", "key", "value", and "ttl".

`/get-resource` - Adds a key-value pair to the table with TTL. Requires "tableID" and "key"

`/get-table-size` - Gets table size. Requires "tableID"

`/delete-resource` - Deletes key-value pair/resource. Requires "tableID" and "key"

## Help
You can use the Issues or Discussions tab in the Github repository for help. That's all for now!

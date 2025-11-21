# Blackbase
An in-memory store for the cloud.
## What Is Blackbase?
Blackbase is a somewhat proof-of-concept database for volatile, non-persistent data that has practical applications in session data management, among other things.

> ### Note
> While tests using this software have usually been successful, if you have any issues or any problems, please contact me in Github directly. This is very important, as I do not use my relay email.
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
const Database = new Blackbase.HttpBlackBase("password", {"*", 12});
```

## Breakdown and HttpBlackBase/HttpsBlackBase
First, let's talk about HttpBlackBase. The only arguments in the constructor are the password for accessing the database and then the rate limiter map, which we'll talk about later, followed by the value for how long in <b>milliseconds</b> the app should wait before letting a user in again. Then you just add the listen method, which is slightly different because it is simply organized, as shown here: `listen(port)`. HttpsBlackBase is what you would expect, organized like `HttpsBlackBase(password, options, ipLimitMaps?, rateLimitMSBeforeRetry?)`

## URL Request Directory
The following URLs can be used for processing a POST request with "password" in the URL-encoded body:

`/create-table` - This is extremely important, without a table you cannot create a resource. Requires "name" in the body.

`/set-resource` - Adds a key-value pair to the table. Requires "tableID", "key", and "value"

`/set-cached-resource` - Adds a key-value pair to the table with TTL. Requires "tableID", "key", "value", and "ttl". (Note: This will not be patched anytime soon. When you use set-cached-resource, you are essentially putting an unstoppable timer on this. It may be fixed later.)

`/get-resource` - Adds a key-value pair to the table with TTL. Requires "tableID" and "key"

`/get-table-size` - Gets table size. Requires "tableID"

`/delete-resource` - Deletes key-value pair/resource. Requires "tableID" and "key"

## IP Limit Maps
IP Limit Maps work like normal Maps. All you have to do is initialize a new `Map()` then use Map.set() according to this description:

`key: value` is equivalent to `urlAddress: maximumRequests`. The following formulas are allowed:

`*: maximumRequests` - Wildcard, all requests fall under this policy. You can also disallow a URL with `*0: maximumRequests` .

`urlAddress: maximumRequests` - A specific request falls under this policy. For example:
```javascript
const Database = new Blackbase.HttpBlackBase("password", {"/url-address", 58});
```

## Help
You can use the Issues or Discussions tab in the Github repository for help. That's all for now! Also  this skipped Version 1 due to a minor error in SemVer.

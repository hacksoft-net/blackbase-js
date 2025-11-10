# Blackbase
An in-memory store for the cloud.
## What Is Blackbase?
Blackbase is a somewhat proof-of-concept database for volatile, non-persistent data that has practical applications in session data management, among other things.

> ### Note
> While tests in memory usage have proven successful (it doesn't use a lot of memory), be very careful when using this software. It may prove volatile and if that is so, immediately contact us using the metadata in the software's package.json (email). Also version 0.1.0 does not have a rate limiter.
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
new Blackbase.HttpBlackBase("badPassword").listen(3000);
```

## Breakdown and HttpBlackBase/HttpsBlackBase
First, let's talk about HttpBlackBase. The only argument in the constructor is the password for accessing the database. Then you just add the listen method, which is slightly different because it is simply organized, as shown here: `listen(port)`. HttpsBlackBase is what you would expect, organized like `HttpBlackBase(password, options)`

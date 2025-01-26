'use strict';
const server = require('./transport/http.js')
const migrations = require('./migrate.js')
const staticServer = require('./static.js');
const loadRoutes = require('./loadRoutes.js')
const path = require('node:path')
const apiPath = path.join(process.cwd(), '/src/api');

(async () => {
   const routing = await loadRoutes(apiPath)
   console.log(routing);

   await migrations()
   server(routing, process.env.API_PORT)
   staticServer('src/static/', process.env.STATIC_PORT)
})()

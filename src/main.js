'use strict';
const server = require('./transport/http.js')
const migrations = require('./migrate.js')
const fsp = require('node:fs').promises
const path = require('node:path')
require('dotenv').config()

const PORT = process.env.PORT

const apiPath = path.join(process.cwd(), '/src/api');
const routing = {};


(async () => {
   const files = await fsp.readdir(apiPath)
   for (const fileName of files) {
      if (!fileName.endsWith('.js')) continue
      const filePath = path.join(apiPath, fileName)
      const serviceName = path.basename(fileName, '.js')
      routing[serviceName] = require(filePath)
   }
   await migrations()
   server(routing, PORT)
})()

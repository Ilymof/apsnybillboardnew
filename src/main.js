const db = require('./db.js')
const server = require('./http.js')
const migrations = require('./migrate.js')
require('dotenv').config()

const PORT =  process.env.PORT 

const routing = {
   cities: db('city'),
}
const init = async () => {
   try {
      await migrations(),
      server(routing, PORT)
   } catch (error) {
      console.log(error)
   }
}
init()
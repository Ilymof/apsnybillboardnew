'use strict'

const  pool = require('./poolDB')
const fs = require('node:fs')
const path = require('node:path')
const checkConnection = require('./checkConnection')


const runMigrations = async  () => {
   try {
      checkConnection(pool)
      const dir = path.join(__dirname, 'migrations')
      const files = ( fs.readdirSync(dir)).sort()
      files.forEach(async file => {
         const sql =  fs.readFileSync(path.join(dir, file), 'utf-8')
         await pool.query(sql)
      })
   } catch (err) {
      console.error(err)
   }
}
module.exports = runMigrations
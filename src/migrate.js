'use strict'

const pool = require('poolDB.js')
const fs = require('node:fs')
const path = require('node:path')
const checkConnection = require('checkConnection.js')

const runMigrations = async () => {
   try {
      checkConnection(pool)
      const dir = path.join(__dirname, 'migrations')
      const files = fs.readdirSync(dir)

      for (const file of files) {
         if (!file.endsWith('.sql')) continue
         const sql = fs.readFileSync(path.join(dir, file), 'utf-8')
         const startTime = Date.now()
         await pool.query(sql)
         console.log(`Успешная миграция ${path.basename(file, path.extname(file))} (время ${Date.now() - startTime} мс) `)
      }
   } catch (err) {
      console.error(`Ошибка миграции: ${err.message}`)
   }
}

module.exports = runMigrations
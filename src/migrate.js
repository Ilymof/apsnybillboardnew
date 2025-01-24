'use strict'

const pool = require('./poolDB')
const fs = require('node:fs')
const path = require('node:path')
const checkConnection = require('./checkConnection')


const runMigrations = async () => {
   try {
      checkConnection(pool);
      const dir = path.join(__dirname, 'migrations');
      const files = fs.readdirSync(dir);

      for (const file of files) {
         if (!file.endsWith('.sql')) continue
         const sql = fs.readFileSync(path.join(dir, file), 'utf-8');
         await pool.query(sql);
         console.log(`Успешная миграция ${file}`);
      }
   } catch (err) {
      console.error(`Ошибка миграции: ${err.message}`);
   }
};
module.exports = runMigrations
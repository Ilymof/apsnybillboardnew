'use strict'
const process = require('node:process')

async function checkConnection(pool) {
   try {
      const client = await pool.connect()
      client.release()
   } catch (error) {
      console.error('Ошибка подключения к базе данных:', error.message)
      process.exit(1)
   }
}
module.exports = checkConnection
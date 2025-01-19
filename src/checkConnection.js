'use strict';

async function checkConnection(pool) {
   try {
      const client = await pool.connect();
      console.log('Успешное подключение к базе данных');
      client.release();
   } catch (error) {
      console.error('Ошибка подключения к базе данных:', error.message);
      process.exit(1);
   }
}
module.exports = checkConnection;
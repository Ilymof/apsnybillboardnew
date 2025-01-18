const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'billboard',
  password: 'g1q38w2h81a021',
  port: 5432,
  max: 20, // Максимальное количество соединений в пуле
  idleTimeoutMillis: 30000, // Таймаут простоя соединения перед его завершением
  connectionTimeoutMillis: 2000, // Максимальное время ожидания подключения
});

module.exports = pool;

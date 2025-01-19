const http = require('node:http')
const pg = require('pg')
const process = require('node:process')

const PORT = 6666

const pool = new pg.Pool({
  host: 'localhost',
  port: 5432,
  database: 'board',
  user: 'postgres',
  password: '5003255'
})

async function checkConnection() {
  try {
    const client = await pool.connect();
    console.log('Успешное подключение к базе данных');
    client.release();
  } catch (error) {
    console.error('Ошибка подключения к базе данных:', error.message);
    process.exit(1);
  }
}
checkConnection();

http.createServer(async (req, res) => {
  res.end('foo')
}).listen(PORT)

console.log(`Listen on port ${PORT}`);
const http = require('node:http');
const pg = require('pg');
const process = require('node:process');
const receiveArgs = require('./body.js');
const db = require('./db.js');
const PORT = 8800;

const pool = new pg.Pool({
   host: 'localhost',
   port: 5432,
   database: 'board',
   user: 'postgres',
   password: '5003255'
});


 

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

const routing = {
   cities: db('city'),
};

const crud = { get: 'read', post: 'create', put: 'update', delete: 'delete' };


http.createServer(async (req, res) => {
   const {method, url, socket} = req;
   const [name, id] = url.substring(1).split('/');
   const entity = routing[name];

   if(!entity) {return void res.end('Not found');}
   const procedure = crud[method.toLowerCase()];
   console.log(procedure);
   const handler = entity[procedure];
   if(!handler) {return void res.end('Not found');}

   const src = handler.toString();
   const signature = src.substring(0, src.indexOf(')'));
   const args = [];

   if (signature.includes('(id')) {args.push(id);}
   if (signature.includes('{')) {args.push(await receiveArgs(req));}

   console.log(`${socket.remoteAddress} ${method} ${url}`);
   const result = await handler(...args);
   res.end(JSON.stringify(result.rows));
}).listen(PORT);
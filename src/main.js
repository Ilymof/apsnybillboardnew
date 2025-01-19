const http = require('node:http');
const receiveArgs = require('./body.js');
const db = require('./db.js');
const PORT = 8800;

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
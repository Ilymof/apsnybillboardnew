const http = require('node:http')

const HEADERS = {
   'X-XSS-Protection': '1; mode=block',
   'X-Content-Type-Options': 'nosniff',
   'Strict-Transport-Security': 'max-age=31536000; includeSubdomains; preload',
   'Access-Control-Allow-Origin': '*',
   'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
   'Access-Control-Allow-Headers': 'Content-Type',
   'Content-Type': 'application/json; charset=UTF-8',
};

const receiveArgs = async (req) => {
   const buffers = [];
   for await (const chunk of req) buffers.push(chunk);
   const data = Buffer.concat(buffers).toString();
   return JSON.parse(data);
};

const server = (routing, port = '3333') => {
   http.createServer(async (req, res) => {
      res.writeHead(200, HEADERS);
      const urlObj = new URL(req.url, `http://${req.headers.host}`);
      const id = urlObj.searchParams.get('id');
      const { url, socket } = req;
      const [place, name, method] = urlObj.pathname.substring(1).split('/');
      if (place !== 'api') {
         res.writeHead(404);
         return res.end('Not found');
      }
      const entity = routing[name];
      if (!entity) {
         res.writeHead(404);
         return res.end('Not found');
      }
      const handler = entity[method.toLowerCase()];
      if (!handler) {
         res.writeHead(405);
         return res.end('Method Not Allowed');
      }
      let body = {};
      if (method === 'POST') {
         try {
            body = await receiveArgs(req);
         } catch (error) {
            res.writeHead(400);
            return res.end('Invalid request body');
         }
      }
      const args = [];
      const src = handler.toString();
      const signature = src.substring(0, src.indexOf(')'));
      if (signature.includes('(id')) args.push(id);
      if (signature.includes('{') && typeof body === 'object') {
         args.push(...Object.values(body));
      }
      console.log(`${socket.remoteAddress} ${method} ${url}`);
      try {
         const result = await handler(...args);
         res.end(JSON.stringify(result));
      } catch (error) {
         res.writeHead(500);
         res.end('Internal server error');
      }
   }).listen(port, () => console.log(`Успешный запуск сервера на порту: ${port}`));
};

module.exports = server
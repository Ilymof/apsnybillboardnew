'use strict';
const http = require('node:http');

const receiveArgs = async (req) => {
   const buffers = [];
   for await (const chunk of req) buffers.push(chunk);
   const data = Buffer.concat(buffers).toString();
   return data.trim() ? JSON.parse(data) : undefined
};

const HEADERS = {
   'X-XSS-Protection': '1; mode=block',
   'X-Content-Type-Options': 'nosniff',
   'Strict-Transport-Security': 'max-age=31536000; includeSubdomains; preload',
   'Access-Control-Allow-Origin': '*',
   'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
   'Access-Control-Allow-Headers': 'Content-Type',
   'Content-Type': 'application/json; charset=UTF-8',
};

module.exports = (routing, port) => {
   http.createServer(async (req, res) => {
      res.writeHead(200, HEADERS);
      const { url, socket } = req;
      const urlObj = new URL(req.url, `http://${req.headers.host}`);
      const [place, name, method] = urlObj.pathname.substring(1).split('/');

      if (place !== 'api') return void res.end('"Not found"');
      const entity = routing[name];
      if (!entity) return void res.end('"Not found"');
      const handler = entity[method];
      if (!handler) return void res.end('"Not found"');
      if (req.method === 'GET') {
         const params = Object.fromEntries(urlObj.searchParams.entries());
         const result = await handler(params);
         res.end(JSON.stringify(result));
      } else {
         const args = await receiveArgs(req);
         const result = await handler(args);
         res.end(JSON.stringify(result));
      }
      console.log(`${socket.remoteAddress} ${method} ${url}`);
   }).listen(port);
   console.log(`API on port ${port}`);
};
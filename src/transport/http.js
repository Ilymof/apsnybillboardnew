'use strict';
const http = require('node:http');

const receiveArgs = async (req) => {
   try {
      const buffers = [];
      for await (const chunk of req) buffers.push(chunk);
      const data = Buffer.concat(buffers).toString();
      return data.trim() ? JSON.parse(data) : undefined;
   } catch {
      return undefined;
   }
};

module.exports = (routing, port) => {
   http
      .createServer(async (req, res) => {
         try {
            const { url, socket, method } = req;
            const urlObj = new URL(req.url, `http://${req.headers.host}`);
            const [place, name, action] = urlObj.pathname.substring(1).split('/');

            if (place !== 'api') return res.end('"Not found"');
            const entity = routing[name];
            if (!entity) return res.end('"Not found"');
            const handler = entity[action];
            if (!handler) return res.end('"Not found"');

            const token = req.headers.authorization || null
            const args =
               method === 'GET'
                  ? Object.fromEntries(urlObj.searchParams.entries())
                  : await receiveArgs(req);

            const result = await handler(args, token);
            res.end(JSON.stringify(result));
            console.log(`${socket.remoteAddress} ${req.method} ${url}`);

         } catch (error) {
            console.log(error);

            res.writeHead(400);
            res.end(JSON.stringify({ error: error || 'Internal Server Error' }));
         }

      })
      .listen(port);

   console.log(`API on port ${port}`);
};
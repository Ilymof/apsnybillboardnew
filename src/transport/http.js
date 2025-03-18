'use strict'
const http = require('node:http')
const { Buffer } = require('buffer')

const receiveArgs = async (req) => {
   try {
      const buffers = []
      for await (const chunk of req) buffers.push(chunk)
      const data = Buffer.concat(buffers).toString()
      return data.trim() ? JSON.parse(data) : undefined
   } catch {
      return undefined
   }
}

const receiveRawBody = async (req) => {
   const buffers = []
   for await (const chunk of req) buffers.push(chunk)
   return Buffer.concat(buffers)
}

module.exports = (routing, port) => {
   http
      .createServer(async (req, res) => {
         try {
            const { url, socket, method } = req
            const urlObj = new URL(req.url, `http://${req.headers.host}`)
            const [place, name, action] = urlObj.pathname.substring(1).split('/')

            if (place !== 'api') {
               res.end('"Not found"')
               return
            }
            const entity = routing[name]
            if (!entity) {
               res.end('"Not found"')
               return
            }
            const handler = entity[action]
            if (!handler) {
               res.end('"Not found"')
               return
            }

            const token = req.headers.authorization || null
            let args

            if (method === 'GET' || method === 'DELETE') {
               args = Object.fromEntries(urlObj.searchParams.entries())
            } else if (method === 'POST') {
               const contentType = req.headers['content-type'] || ''
               if (contentType.includes('multipart/form-data')) {
                  const rawBody = await receiveRawBody(req)
                  args = { headers: req.headers, body: rawBody }
               } else {
                  args = await receiveArgs(req)
               }
            } 
            const result = await handler(args, token)
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(result))
            console.log(`${socket.remoteAddress} ${req.method} ${url}`)
         } catch (error) {
            console.error(error)
            res.writeHead(400, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: error.message || 'Internal Server Error' }))
         }
      })
      .listen(port)

   console.log(`API on port ${port}`)
}
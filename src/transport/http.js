'use strict'
const http = require('node:http')
const { Buffer } = require('buffer')
const fs = require('fs').promises // Для асинхронного чтения файлов
const path = require('path')
const restrictAccess = require('../lib/restrictAccess')
const { ACCESS_CONTROL } = require('../roles')

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

// MIME-типы для разных файлов
const mimeTypes = {
   '.jpg': 'image/jpeg',
   '.jpeg': 'image/jpeg',
   '.png': 'image/png',
   '.html': 'text/html',
   '.css': 'text/css',
   '.js': 'application/javascript'
}

module.exports = (routing, port) => {
   http
      .createServer(async (req, res) => {
         try {
            const { url, socket, method } = req
            const urlObj = new URL(req.url, `http://${req.headers.host}`)
            const pathParts = urlObj.pathname.substring(1).split('/')

            const [place, name, action, categoryPath, subcategoryPath] = pathParts

            if (place !== 'api') {
               const filePath = path.join(__dirname, '../../uploads', urlObj.pathname) 
               try {
                  const data = await fs.readFile(filePath)
                  const ext = path.extname(filePath).toLowerCase()
                  const contentType = mimeTypes[ext] || 'application/octet-stream'
                  res.writeHead(200, { 'Content-Type': contentType })
                  res.end(data)
                  console.log(`${socket.remoteAddress} ${method} ${url} - Static file served`)
                  return
               } catch (err) {
                  console.error(`Error serving file: ${err.message}`) 
                  res.writeHead(404, { 'Content-Type': 'text/plain' })
                  res.end('404 Not Found')
                  console.log(`${socket.remoteAddress} ${method} ${url} - File not found`)
                  return
               }
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
               if (categoryPath) args.categoryPath = categoryPath
               if (subcategoryPath) args.subcategoryPath = subcategoryPath
            } else if (method === 'POST') {
               const contentType = req.headers['content-type'] || ''
               if (contentType.includes('multipart/form-data')) {
                  const rawBody = await receiveRawBody(req)
                  args = { headers: req.headers, body: rawBody }
               } else {
                  args = await receiveArgs(req)
               }
            }

            const cleanUrl = `/api/${name}/${action}`
            if (Object.keys(ACCESS_CONTROL).includes(cleanUrl)) {
               req.user = restrictAccess(token, cleanUrl)
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
      .listen(port, '0.0.0.0', () => {
         console.log(`API server on port ${port}`)
      })
}
'use strict'
const http = require('node:http')
const { Buffer } = require('buffer')
const fs = require('fs').promises
const path = require('path')
const restrictAccess = require('../lib/restrictAccess')
const { ACCESS_CONTROL } = require('../roles')
const cron = require('node-cron')
const db = require('../db')
const token = db('tokens')

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

const mimeTypes = {
   '.html': 'text/html',
   '.js': 'application/javascript',
   '.css': 'text/css',
   '.jpg': 'image/jpeg',
   '.jpeg': 'image/jpeg',
   '.png': 'image/png',
   '.webp': 'image/webp'
}
const allowedOrigins = [
   'https://apsny-billboard-production.up.railway.app',
   'http://localhost:5173'
]
module.exports = (routing, port) => {
   http
      .createServer(async (req, res) => {
         const origin = req.headers.origin
         if (allowedOrigins.includes(origin)) {
            res.setHeader('Access-Control-Allow-Origin', origin)
         } else {
            res.setHeader('Access-Control-Allow-Origin', '')
         }
         res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
         res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

         if (req.method === 'OPTIONS') {
            res.writeHead(204)
            res.end()
            console.log(`${req.socket.remoteAddress} ${req.method} ${req.url} - CORS preflight`)
            return
         }

         try {
            const { url, socket, method } = req
            const urlObj = new URL(req.url, `http://${req.headers.host}`)
            const pathParts = urlObj.pathname.substring(1).split('/')
            const [place] = pathParts

            if (place === 'api') {
               const [, name, action, categoryPath, subcategoryPath] = pathParts
               const entity = routing[name]
               if (!entity) {
                  res.writeHead(404, { 'Content-Type': 'application/json' })
                  res.end('"Not found"')
                  return
               }
               const handler = entity[action]
               if (!handler) {
                  res.writeHead(404, { 'Content-Type': 'application/json' })
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
               return
            }

            // Обработка статических файлов
            let filePath
            if (urlObj.pathname.startsWith('/uploads')) {
               filePath = path.join('/uploads', urlObj.pathname.substring('/uploads'.length))
               console.log(`Trying to serve upload file: ${filePath}`)
            } else {
               const rootDir = path.join(__dirname, '../../frontend/dist')
               filePath = path.join(rootDir, urlObj.pathname)
               console.log(`Trying to serve frontend file: ${filePath}`)

               try {
                  const stats = await fs.stat(filePath)
                  if (stats.isFile()) {
                     const data = await fs.readFile(filePath)
                     const ext = path.extname(filePath).toLowerCase()
                     const contentType = mimeTypes[ext] || 'application/octet-stream'
                     res.writeHead(200, { 'Content-Type': contentType })
                     res.end(data)
                     console.log(`${socket.remoteAddress} ${method} ${url} - File served`)
                     return
                  }
               } catch (err) {
                  console.log(`File not found, treating as SPA route: ${filePath}`)
               }

               const indexPath = path.join(rootDir, 'index.html')
               console.log(`Serving SPA index: ${indexPath}`)
               try {
                  const data = await fs.readFile(indexPath)
                  res.writeHead(200, { 'Content-Type': 'text/html' })
                  res.end(data)
                  console.log(`${socket.remoteAddress} ${method} ${url} - SPA index.html served`)
               } catch (indexErr) {
                  console.error(`Error reading index.html ${indexPath}: ${indexErr.message}`)
                  res.writeHead(404, { 'Content-Type': 'text/plain' })
                  res.end('404 Not Found')
                  console.log(`${socket.remoteAddress} ${method} ${url} - File not found`)
               }
               return
            }

            // Обработка uploads
            try {
               const data = await fs.readFile(filePath)
               const ext = path.extname(filePath).toLowerCase()
               const contentType = mimeTypes[ext] || 'application/octet-stream'
               res.writeHead(200, { 'Content-Type': contentType })
               res.end(data)
               console.log(`${socket.remoteAddress} ${method} ${url} - File served`)
            } catch (err) {
               console.error(`Error reading upload file ${filePath}: ${err.message}`)
               res.writeHead(404, { 'Content-Type': 'text/plain' })
               res.end('404 Not Found')
               console.log(`${socket.remoteAddress} ${method} ${url} - Upload file not found`)
            }
         } catch (error) {
            console.error(error)
            res.writeHead(400, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: error.message || 'Internal Server Error' }))
         }
      }) 
      .listen(port, '0.0.0.0', () => {
         console.log(`API server on port ${port}`)
      }),
   cron.schedule('0 * * * *', async () => {
      try {
         const sql = 'DELETE FROM tokens WHERE expires_at < NOW() RETURNING *;'
         const result = await token.query(sql)
         console.log(`Удалено истёкших токенов: ${result.rowCount}`)
      } catch (error) {
         console.error('Ошибка очистки токенов:', error)
      }
   })
}
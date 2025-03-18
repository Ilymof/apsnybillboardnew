'use strict'

const fs = require('fs')
const path = require('path')
const { Buffer } = require('buffer')

const uploadDir = path.join(__dirname, '../../uploads')
if (!fs.existsSync(uploadDir)) {
   fs.mkdirSync(uploadDir, { recursive: true })
}

function parseMultipart(buffer, boundary) {
   const boundaryBytes = Buffer.from(`--${boundary}`)
   const parts = []
   let start = buffer.indexOf(boundaryBytes) + boundaryBytes.length
   let end = buffer.indexOf(boundaryBytes, start)

   while (end !== -1) {
      const partBuffer = buffer.slice(start, end)
      const headerEnd = partBuffer.indexOf('\r\n\r\n') + 4
      const headersRaw = partBuffer.slice(0, headerEnd - 4).toString('utf-8')
      const data = partBuffer.slice(headerEnd)

      const headers = headersRaw.split('\r\n').reduce((acc, line) => {
         const [key, value] = line.split(': ')
         if (key && value) acc[key.toLowerCase()] = value
         return acc
      }, {})

      parts.push({ headers, data })

      start = end + boundaryBytes.length
      end = buffer.indexOf(boundaryBytes, start)
   }

   return parts
}

async function processMultipart(body, boundary) {
   const parts = parseMultipart(body, boundary)
   const fields = {}
   const files = []

   for (const part of parts) {
      const disposition = part.headers['content-disposition']
      if (!disposition) continue

      const nameMatch = disposition.match(/name="([^"]+)"/)
      const filenameMatch = disposition.match(/filename="([^"]+)"/)
      const name = nameMatch ? nameMatch[1] : null

      if (filenameMatch) {
         const filename = filenameMatch[1]
         const uniqueFilename = `${Date.now()}-${Math.round(Math.random() * 1E9)}-${filename}`
         const filepath = path.join(uploadDir, uniqueFilename)

         await new Promise((resolve, reject) => {
            fs.writeFile(filepath, part.data, (err) => {
               if (err) reject(err)
               else resolve()
            })
         })

         files.push({ name, filepath: `${uniqueFilename}` })
      } else {
         fields[name] = part.data.toString('utf-8').trim()
      }
   }

   return { fields, files }
}

module.exports = { processMultipart }
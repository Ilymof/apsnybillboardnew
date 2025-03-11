'use strict'

const fs = require('fs/promises')
const path = require('path')

/**
 * Загружает маршруты из указанной директории.
 * @param {string} apiPath - Путь до директории с файлами API.
 * @param {string} basePath - Базовый путь для создания ключей маршрутов.
 * @returns {Promise<Object>} - Объект с маршрутами.
 */
const loadRoutes = async (apiPath, basePath = '') => {
   const routing = {}
   const files = await fs.readdir(apiPath, { withFileTypes: true })

   for (const file of files) {
      const filePath = path.join(apiPath, file.name)
      if (file.isDirectory()) {
         const subRoutes = await loadRoutes(filePath, path.join(basePath, file.name))
         Object.assign(routing, subRoutes)
      } else if (file.isFile() && file.name.endsWith('.js')) {
         const serviceName = path.basename(file.name, '.js')
         const key = path.join(basePath, serviceName).replace(/\\/g, '/')
         routing[key] = require(filePath)
      }
   }
   return routing
}
module.exports = loadRoutes
const ListingStorage = require('../../storages/ListingStorage')
const errorHandler = require('../../lib/errorHandler')
const TokenService = require('../../services/auth/JWTService')
const removeBearer = require('../../lib/removeBearer')
const { processMultipart } = require('../../lib/multipartParser')
const PermissionError = require('../../lib/PermeationError')
const { promises: fs } = require('fs')
const path = require('path') // Добавляем path для работы с путями
const crypto = require('crypto')

const createListing = async (rawBody, token) => {
   try {
      const clearToken = removeBearer(token)
      if (!clearToken) throw PermissionError.unauthorized()

      const decodedToken = TokenService.decodeToken(clearToken)
      if (!decodedToken) throw PermissionError.unauthorized()

      const userId = decodedToken.sub

      const boundary = rawBody.headers['content-type'].split('boundary=')[1]
      if (!boundary) throw new Error('Invalid multipart/form-data')

      const { fields, files } = await processMultipart(rawBody.body, boundary)

      const uploadDir = '/uploads'
      await fs.mkdir(uploadDir, { recursive: true })

      const imageFiles = files.filter(f => f.name.startsWith('images'))
      const imagePaths = []

      if (!imageFiles.length) {
         throw new Error('At least one image is required')
      }

      const imagemin = (await import('imagemin')).default
      const imageminWebp = (await import('imagemin-webp')).default

      for (const file of imageFiles) {
         const randomString = crypto.randomBytes(16).toString('hex')
         const timestamp = Date.now()
         const newFilename = `${timestamp}${randomString}.webp` // Без тире: 17440575657979f5055947bea8a15080f3fc09005c4a1.webp
         const originalPath = file.filepath

         await fs.access(originalPath)

         // Конвертируем изображение
         const convertedFiles = await imagemin([originalPath], {
            destination: uploadDir,
            plugins: [
               imageminWebp({
                  quality: 80,
                  resize: { width: 800, height: 0 }
               })
            ]
         })

         // Предполагаем, что imagemin возвращает путь к сконвертированному файлу
         const convertedFilePath = convertedFiles[0].destinationPath // Получаем путь к новому файлу
         const finalPath = path.join(uploadDir, newFilename)

         // Переименовываем сконвертированный файл в нужное имя
         await fs.rename(convertedFilePath, finalPath)

         try {
            await fs.unlink(originalPath)
            console.log(`Deleted original file: ${originalPath}`)
         } catch (err) {
            console.error(`Failed to delete original file: ${originalPath}`, err.message)
         }

         imagePaths.push(newFilename)
      }

      const { title, description, price, city_id, category_id, subcategory_id, telegram, whatsapp, phone, expiration_days } = fields

      const expDays = parseInt(expiration_days, 10)
      if (isNaN(expDays) || expDays < 1 || expDays > 30) {
         throw new Error('Кол-во дней должно быть не больше 30')
      }

      const listing = {
         user_id: userId,
         city_id: city_id ? parseInt(city_id, 10) : null,
         category_id: category_id ? parseInt(category_id, 10) : null,
         subcategory_id: subcategory_id ? parseInt(subcategory_id, 10) : null,
         title,
         telegram: telegram || null,
         whatsapp: whatsapp || null,
         phone: phone || null,
         description,
         price: price ? parseFloat(price) : null,
         images: imagePaths,
         created_at: new Date(),
         expiration_days: expDays
      }

      const createdListing = await ListingStorage.create(listing)
      return createdListing
   } catch (error) {
      throw errorHandler(error)
   }
}

module.exports = createListing
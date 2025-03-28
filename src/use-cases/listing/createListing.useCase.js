const ListingStorage = require('../../storages/ListingStorage')
const errorHandler = require('../../lib/errorHandler')
const TokenService = require('../../services/auth/JWTService')
const removeBearer = require('../../lib/removeBearer')
const { processMultipart } = require('../../lib/multipartParser')
const PermissionError = require('../../lib/PermeationError')
const { promises: fs } = require('fs')
const path = require('path')

// Динамический импорт будет выполнен позже в коде
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

      const uploadDir = path.join(__dirname, '../../../uploads')
      const tempDir = path.join(__dirname, '../../../tmp')
      await fs.mkdir(uploadDir, { recursive: true })
      await fs.mkdir(tempDir, { recursive: true })

      const imageFiles = files.filter(f => f.name.startsWith('images'))
      const imagePaths = []

      if (!imageFiles.length) {
         throw new Error('At least one image is required')
      }

      // Динамически импортируем imagemin и imagemin-webp
      const imagemin = (await import('imagemin')).default
      const imageminWebp = (await import('imagemin-webp')).default

      for (const file of imageFiles) {
         const originalFilename = path.basename(file.filepath)
         const filename = originalFilename.replace(/\.[^/.]+$/, '.webp')

         const tempPath = path.isAbsolute(file.filepath)
            ? file.filepath
            : path.join(tempDir, file.filepath)

         try {
            await fs.access(tempPath)
         } catch (err) {
            throw new Error(`Input file is missing: ${file.filepath}`)
         }

         await imagemin([tempPath], {
            destination: uploadDir,
            plugins: [
               imageminWebp({
                  quality: 80,
                  resize: { width: 800, height: 0 }
               })
            ]
         })

         imagePaths.push(filename)
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

      try {
         const tmpFiles = await fs.readdir(tempDir)
         for (const tmpFile of tmpFiles) {
            const filePath = path.join(tempDir, tmpFile)
            await fs.unlink(filePath)
            console.log('Deleted temp file:', filePath)
         }
      } catch (err) {
         console.error('Failed to clear temp directory:', err)
      }

      return createdListing
   } catch (error) {
      throw errorHandler(error)
   }
}

module.exports = createListing
'use strict'

const { promises: fs } = require('fs')
const path = require('path')
const ListingStorage = require('@storages/ListingStorage')
const TokenService = require('@services/auth/JWTService')
const errorHandler = require('@lib/errorHandler')
const removeBearer = require('@lib/removeBearer')
const { processMultipart } = require('@lib/multipartParser')
const PermeationError = require('../../lib/PermeationError')

const updateListing = async (listingData, token) => {
   try {
      const clearToken = removeBearer(token)
      if (!clearToken) throw PermeationError.unauthorized()

      const decodedToken = TokenService.decodeToken(clearToken)
      if (!decodedToken) throw PermeationError.unauthorized()

      const userId = decodedToken.sub

      const contentType = listingData.headers['content-type'] || ''
      let fields, imagePaths

      const uploadDir = path.join(__dirname, '../../../uploads')
      const tempDir = path.join(__dirname, '../../../tmp')
      await fs.mkdir(uploadDir, { recursive: true })
      await fs.mkdir(tempDir, { recursive: true })

      if (contentType.includes('multipart/form-data')) {
         const boundary = contentType.split('boundary=')[1]
         if (!boundary) throw new Error('Invalid multipart/form-data')

         const { fields: parsedFields, files } = await processMultipart(listingData.body, boundary)
         fields = parsedFields

         const imageFiles = files.filter(f => f.name === 'images')
         imagePaths = []

         if (imageFiles.length > 0) {
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

            // Очистка tmp
            try {
               const tmpFiles = await fs.readdir(tempDir)
               for (const tmpFile of tmpFiles) {
                  await fs.unlink(path.join(tempDir, tmpFile))
               }
            } catch (err) {
               console.error('Failed to clear temp directory:', err)
            }
         }
      } else {
         fields = listingData
         imagePaths = fields.images
      }

      const { listingId, title, description, price, city_id, category_id, subcategory_id, telegram, whatsapp, phone, expiration_days, updated_at } = fields
      if (!listingId) throw new Error('Listing ID is required')

      const currentListing = await ListingStorage.get(listingId)
      if (!currentListing) throw new Error('Listing not found')
      if (currentListing.author_id !== userId) throw new Error('Unauthorized: You are not the owner of this listing')

      // Удаление старых изображений, если переданы новые
      if (imagePaths && imagePaths.length > 0 && currentListing.images) {
         for (const oldImage of currentListing.images) {
            const oldFilePath = path.join(__dirname, '../../../uploads', oldImage)
            try {
               await fs.access(oldFilePath)
               await fs.unlink(oldFilePath)
            } catch (err) {
               console.error('Failed to delete old image:', oldFilePath, err.message)
            }
         }
      }

      const updatedListing = await ListingStorage.update(listingId, {
         title,
         description,
         telegram,
         whatsapp,
         phone,
         price: price ? parseFloat(price) : undefined,
         city_id: city_id ? parseInt(city_id, 10) : undefined,
         category_id: category_id ? parseInt(category_id, 10) : undefined,
         subcategory_id: subcategory_id ? parseInt(subcategory_id, 10) : undefined,
         images: imagePaths && imagePaths.length > 0 ? imagePaths : currentListing.images,
         expiration_days,
         updated_at
      })

      return updatedListing
   } catch (error) {
      throw errorHandler(error)
   }
}

module.exports = updateListing
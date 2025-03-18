'use strict'

const fs = require('fs')
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
      console.log(decodedToken)
      
      if (!decodedToken) throw PermeationError.unauthorized()

      const userId = decodedToken.sub

      const contentType = listingData.headers['content-type'] || ''
      let fields, imagePaths

      if (contentType.includes('multipart/form-data')) {
         const boundary = contentType.split('boundary=')[1]
         if (!boundary) throw new Error('Invalid multipart/form-data')

         const { fields: parsedFields, files } = await processMultipart(listingData.body, boundary)
         fields = parsedFields
         imagePaths = files.filter(f => f.name === 'images').map(f => f.filepath)
      } else {
         fields = listingData
         imagePaths = fields.images
      }

      const { listingId, title, description, price, city_id, category_id, subcategory_id } = fields
      if (!listingId) throw new Error('Listing ID is required')

      const currentListing = await ListingStorage.get(listingId, userId)
      if (!currentListing) throw new Error('Listing not found or access denied')

      if (imagePaths && imagePaths.length > 0 && currentListing.images) {
         for (const oldImage of currentListing.images) {
            const oldFilePath = path.join(__dirname, '../../uploads', oldImage)
            if (fs.existsSync(oldFilePath)) {
               fs.unlinkSync(oldFilePath)
            }
         }
      }

      const updatedListing = await ListingStorage.update(listingId, userId, {
         title,
         description,
         price: price ? parseFloat(price) : undefined,
         city_id: city_id ? parseInt(city_id, 10) : undefined,
         category_id: category_id ? parseInt(category_id, 10) : undefined,
         subcategory_id: subcategory_id ? parseInt(subcategory_id, 10) : undefined,
         images: imagePaths && imagePaths.length > 0 ? imagePaths : currentListing.images
      })

      return updatedListing
   } catch (error) {
      throw errorHandler(error)
   }
}


module.exports = updateListing
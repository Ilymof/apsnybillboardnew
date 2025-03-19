'use strict'

const fs = require('fs')
const path = require('path')
const ListingStorage = require('@storages/ListingStorage')
const TokenService = require('@services/auth/JWTService')
const errorHandler = require('@lib/errorHandler')
const removeBearer = require('@lib/removeBearer')
const PermeationError = require('../../lib/PermeationError')

const deleteAnyListing = async (queryParams, token) => {
   try {
      const clearToken = removeBearer(token)
      if (!clearToken) throw PermeationError.unauthorized()

      const decodedToken = TokenService.decodeToken(clearToken)
      if (!decodedToken) throw PermeationError.unauthorized()

      const userId = decodedToken.sub
      const { listingId } = queryParams || {} 
      if (!listingId) throw new Error('Listing ID is required')

      const currentListing = await ListingStorage.get(listingId, userId)
      if (!currentListing) throw new Error('Listing not found or access denied')

     
      if (currentListing.images && currentListing.images.length > 0) {
         for (const image of currentListing.images) {
            const filePath = path.join(__dirname, '../../uploads', image)
            if (fs.existsSync(filePath)) {
               fs.unlinkSync(filePath) 
            }
         }
      }

      const deletedListing = await ListingStorage.delete(listingId, userId)
      return { success: true, message: 'Listing deleted successfully', listing: deletedListing }
   } catch (error) {
      throw errorHandler(error)
   }
}

module.exports = deleteAnyListing
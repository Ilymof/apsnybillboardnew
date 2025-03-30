'use strict'

const { promises: fs } = require('fs')
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
      const listing = await ListingStorage.get(listingId)

      if (!listing) {
         throw new Error('Listing not found')
      }

      const currentListing = await ListingStorage.get(listingId, userId)
      if (!currentListing) throw new Error('Listing not found or access denied')

      if (currentListing.images && currentListing.images.length > 0) {
         for (const image of currentListing.images) {
            const filePath = path.join('/uploads', image)
            try {
               await fs.access(filePath)
               await fs.unlink(filePath)
            } catch (err) {
               console.error('Failed to delete image:', filePath, err.message)
            }
         }
      }

      const deletedListing = await ListingStorage.deleteAny(listingId, userId)
      return {
         message: deletedListing,
         listing: 'Listing deleted'
      }
   } catch (error) {
      throw errorHandler(error)
   }
}

module.exports = deleteAnyListing
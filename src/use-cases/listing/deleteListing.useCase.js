'use strict'

const fs = require('fs')
const path = require('path')
const ListingStorage = require('@storages/ListingStorage')
const TokenService = require('@services/auth/JWTService')
const errorHandler = require('@lib/errorHandler')
const removeBearer = require('@lib/removeBearer')
const PermeationError = require('../../lib/PermeationError')
const getUserListings = require('../../use-cases/listing/getUserListings.useCase')

const deleteListing = async (queryParams, token) => {
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

      if (listing.author_id !== userId) {
         throw new Error('Unauthorized: You are not the owner of this listing')
      }

      const currentListing = await ListingStorage.get(listingId, userId)
      if (!currentListing) throw new Error('Listing not found or access denied')

     
      if (currentListing.images && currentListing.images.length > 0) {
         for (const image of currentListing.images) {
            const filePath = path.join(__dirname, '../../../uploads', image)
            if (fs.existsSync(filePath)) {
               fs.unlinkSync(filePath) 
            }
         }
      }

      await ListingStorage.delete(listingId, userId)
      const listingsData = await getUserListings({}, clearToken)

      return { 
         success: true, 
         message: 'Listing deleted successfully', 
         listings: listingsData.listings,
         total: listingsData.total
      }
   } catch (error) {
      throw errorHandler(error)
   }
}

module.exports = deleteListing
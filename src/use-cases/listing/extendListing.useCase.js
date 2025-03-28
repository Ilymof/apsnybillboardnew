'use strict'

const ListingStorage = require('@storages/ListingStorage')
const TokenService = require('@services/auth/JWTService')
const errorHandler = require('@lib/errorHandler')
const removeBearer = require('@lib/removeBearer')
const PermeationError = require('../../lib/PermeationError')
const getUserListings = require('../../use-cases/listing/getUserListings.useCase')

const extendListing = async (listingData, token) => {
   try {
      const clearToken = removeBearer(token)
      if (!clearToken) throw PermeationError.unauthorized()

      const decodedToken = TokenService.decodeToken(clearToken)
      if (!decodedToken) throw PermeationError.unauthorized()

      const userId = decodedToken.sub
      const { listingId, extendDays } = listingData
      if (!listingId) throw new Error('Listing ID is required')

      const currentListing = await ListingStorage.get(listingId)
      if (!currentListing) throw new Error('Listing not found')
      if (currentListing.author_id !== userId) throw new Error('Unauthorized: You are not the owner of this listing')

      // const now = new Date()
      // const createdDate = new Date(currentListing.updated_at)
      // const expiresAt = new Date(createdDate.getTime() + currentListing.expiration_days * 24 * 60 * 60 * 1000)
      // const daysLeft = Math.ceil((expiresAt - now) / (24 * 60 * 60 * 1000))

      // if (daysLeft > 2) {
      //    throw new Error('Extension only allowed when 2 or fewer days remain')
      // }

      if (isNaN(extendDays) || extendDays < 1 || extendDays > 30) {
         throw new Error('Extension days must be between 1 and 30')
      }

      await ListingStorage.update(listingId, {
         expiration_days: extendDays,
         updated_at: new Date() 
      })

      const listingsData = await getUserListings({}, clearToken)

      return { 
         success: true, 
         message: 'Listing extending successfully', 
         listings: listingsData.listings,
         total: listingsData.total
      }
   } catch (error) {
      throw errorHandler(error)
   }
}

module.exports = extendListing
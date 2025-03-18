'use strict'

const ListingStorage = require('@storages/ListingStorage')
const TokenService = require('@services/auth/JWTService')
const errorHandler = require('@lib/errorHandler')
const removeBearer = require('@lib/removeBearer')
const PermeationError = require('../../lib/PermeationError')

const extendListing = async (listingData, token) => {
   try {
      const clearToken = removeBearer(token)
      if (!clearToken) throw PermeationError.unauthorized()

      const decodedToken = TokenService.decodeToken(clearToken)
      if (!decodedToken) throw PermeationError.unauthorized()

      const userId = decodedToken.sub
      const { listingId, extendDays } = listingData
      if (!listingId) throw new Error('Listing ID is required')

      const currentListing = await ListingStorage.get(listingId, userId)
      if (!currentListing) throw new Error('Listing not found or access denied')

      const now = new Date()
      const createdDate = new Date(currentListing.created_at)
      const expiresAt = new Date(createdDate.getTime() + currentListing.expiration_days * 24 * 60 * 60 * 1000)
      const daysLeft = Math.ceil((expiresAt - now) / (24 * 60 * 60 * 1000))

      if (daysLeft > 2) {
         throw new Error('Extension only allowed when 2 or fewer days remain')
      }

      const newExpDays = parseInt(extendDays, 10)
      if (isNaN(newExpDays) || newExpDays < 3 || newExpDays > 30) {
         throw new Error('Extension days must be between 3 and 30')
      }

      const updatedListing = await ListingStorage.update(listingId, userId, {
         expiration_days: newExpDays,
         created_at: new Date() // Сбрасываем дату создания на текущую
      })

      return { success: true, message: 'Listing extended', listing: updatedListing }
   } catch (error) {
      throw errorHandler(error)
   }
}

module.exports = extendListing
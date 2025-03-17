'use strict'

const ListingStorage = require('@storages/ListingStorage')
const TokenService = require('@services/auth/JWTService')
const errorHandler = require('@lib/errorHandler')
const removeBearer = require('@lib/removeBearer')
const PermeationError = require('../../lib/PermeationError') // Исправил опечатку

const deleteListing = async (listingData, token) => {
   try {
      const clearToken = removeBearer(token)
      if (!clearToken) throw PermeationError.unauthorized()

      const decodedToken = TokenService.decodeToken(clearToken)
      if (!decodedToken) throw PermeationError.unauthorized()

      const userId = decodedToken.sub
      const { listingId } = listingData
      if (!listingId) throw new Error('Listing ID is required')

      const deletedListing = await ListingStorage.delete(listingId, userId)
      return { success: true, message: 'Listing deleted successfully', listing: deletedListing }
   } catch (error) {
      throw errorHandler(error)
   }
}

module.exports = deleteListing
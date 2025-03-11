const ListingStorage = require('@storages/ListingStorage')
const errorHandler = require('@lib/errorHandler')
const TokenService = require('@services/auth/JWTService')
const removeBearer = require('@lib/removeBearer')
const PermissionError = require('../../lib/PermeationError')
const createListing = async (listing, token) => {
   try {
      const clearToken = removeBearer(token)
      if (!clearToken) throw PermissionError.unauthorized()
      TokenService.verifyAccessToken(clearToken)
      const rawRows = await ListingStorage.create(listing)
      return rawRows
   } catch (error) {
      throw errorHandler(error)
   }
}

module.exports = createListing
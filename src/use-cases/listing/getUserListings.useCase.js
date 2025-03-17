const ListingStorage = require('@storages/ListingStorage')
const TokenService = require('@services/auth/JWTService')
const errorHandler = require('@lib/errorHandler')
const removeBearer = require('@lib/removeBearer')
const PermeationError = require('../../lib/PermeationError')

const getUserListings = async (queryParams,token) => {
   try {
      const clearToken = removeBearer(token)
      if (!clearToken) throw PermeationError.unauthorized()

      const decodedToken = TokenService.decodeToken(clearToken)
      if (!decodedToken) throw PermeationError.unauthorized()
      
      const userId = decodedToken.sub
      const listings = await ListingStorage.getAllUserListings(userId)
      return listings
   } catch (error) {
      throw errorHandler(error)
   }
}

module.exports = getUserListings
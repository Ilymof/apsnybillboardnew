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
      const { listings: rawListings, total } = await ListingStorage.getAllUserListings(userId)
      const listingsWithExpires = rawListings.map(listing => {
         const { updated_at, expiration_days } = listing
         const createdDate = new Date(updated_at)
         const expiresAt = new Date(createdDate.getTime() + expiration_days * 24 * 60 * 60 * 1000)
         return {
            ...listing,
            expiresAt
         }
      })
      return {
         listings: listingsWithExpires,
         total
      }
   } catch (error) {
      throw errorHandler(error)
   }
}

module.exports = getUserListings
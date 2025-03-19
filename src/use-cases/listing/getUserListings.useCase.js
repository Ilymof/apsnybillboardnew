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
      const listingsWithExpires = listings.map(listing => {
         const { created_at, expiration_days } = listing
         const createdDate = new Date(created_at)
         const expiresAt = new Date(createdDate.getTime() + expiration_days * 24 * 60 * 60 * 1000)
         return {
            ...listing, // Копируем все существующие поля
            expiresAt   // Добавляем новое поле
         }
      })
      return listingsWithExpires
   } catch (error) {
      throw errorHandler(error)
   }
}

module.exports = getUserListings
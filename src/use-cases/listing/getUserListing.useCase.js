const ListingStorage = require('@storages/ListingStorage')
const TokenService = require('@services/auth/JWTService')
const errorHandler = require('@lib/errorHandler')
const removeBearer = require('@lib/removeBearer')
const PermeationError = require('../../lib/PermeationError')

const getUserListing = async (queryParams, token) => {
   try {
      const clearToken = removeBearer(token)
      if (!clearToken) throw PermeationError.unauthorized()

      const decodedToken = TokenService.decodeToken(clearToken)
      if (!decodedToken) throw PermeationError.unauthorized()

      const userId = decodedToken.sub
      const { listingId } = queryParams || {}
      if (!listingId) throw new Error('Listing ID is required')

      const listing = await ListingStorage.get(listingId)

      if (!listing) throw new Error('Listing not found')
      if (listing.author_id !== userId) {
         throw PermeationError.unauthorized('You are not the owner of this listing')
      }

      const { updated_at, expiration_days } = listing
   

      let daysUntilExpiration = null
      if (updated_at && expiration_days != null) {
         const now = new Date() // Текущая дата
         const updatedDate = new Date(updated_at)
         if (!isNaN(updatedDate.getTime())) { // Проверяем валидность даты
            const expiresAt = new Date(updatedDate.getTime() + expiration_days * 24 * 60 * 60 * 1000)
            const timeLeftMs = expiresAt.getTime() - now.getTime() // Разница в миллисекундах
            daysUntilExpiration = Math.ceil(timeLeftMs / (24 * 60 * 60 * 1000)) // Переводим в дни
            daysUntilExpiration = daysUntilExpiration >= 0 ? daysUntilExpiration : 0 // Если срок истек, возвращаем 0
         }
      }

      listing.daysUntilExpiration = daysUntilExpiration

      return listing
   } catch (error) {
      throw errorHandler(error)
   }
}

module.exports = getUserListing
'use strict'

const ListingStorage = require('@storages/ListingStorage')
const TokenService = require('@services/auth/JWTService')
const errorHandler = require('@lib/errorHandler')
const removeBearer = require('@lib/removeBearer')
const PermeationError = require('../../lib/PermeationError')

const getUserListings = async (queryParams, token) => {
   try {
      const clearToken = removeBearer(token)
      if (!clearToken) throw PermeationError.unauthorized()

      const decodedToken = TokenService.decodeToken(clearToken)
      if (!decodedToken) throw PermeationError.unauthorized()

      const userId = decodedToken.sub
      const { listings: rawListings, total } = await ListingStorage.getAllUserListings(userId)

      const listingsWithDaysLeft = rawListings.map(listing => {
         const { updated_at, expiration_days } = listing // Используем updated_at вместо updated_at
         const now = new Date() // Текущая дата

         // Проверяем, что updated_at и expiration_days валидны
         if (!updated_at || expiration_days == null) {
            return {
               ...listing,
               daysUntilExpiration: null // Если данных нет, возвращаем null
            }
         }

         const createdDate = new Date(updated_at)
         const expiresAt = new Date(createdDate.getTime() + expiration_days * 24 * 60 * 60 * 1000)
         const timeLeftMs = expiresAt.getTime() - now.getTime() // Разница в миллисекундах
         const daysUntilExpiration = Math.ceil(timeLeftMs / (24 * 60 * 60 * 1000)) // Переводим в дни

         return {
            ...listing,
            daysUntilExpiration: daysUntilExpiration >= 0 ? daysUntilExpiration : 0 // Если срок истек, возвращаем 0
         }
      })

      return {
         listings: listingsWithDaysLeft,
         total
      }
   } catch (error) {
      throw errorHandler(error)
   }
}

module.exports = getUserListings
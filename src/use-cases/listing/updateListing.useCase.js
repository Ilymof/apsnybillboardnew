'use strict'

const ListingStorage = require('@storages/ListingStorage')
const TokenService = require('@services/auth/JWTService')
const errorHandler = require('@lib/errorHandler')
const removeBearer = require('@lib/removeBearer')
const PermeationError = require('../../lib/PermeationError') // Исправил опечатку

const updateListing = async (listingData, token) => {
   try {
      const clearToken = removeBearer(token)
      if (!clearToken) throw PermeationError.unauthorized()

      const decodedToken = TokenService.decodeToken(clearToken)
      if (!decodedToken) throw PermeationError.unauthorized()

      const userId = decodedToken.sub
      const { listingId, title, description, price, images, city_id, category_id, subcategory_id } = listingData
      if (!listingId) throw new Error('Listing ID is required')

      const updatedListing = await ListingStorage.update(listingId, userId, { 
         title, 
         description, 
         price, 
         images, 
         city_id, 
         category_id, 
         subcategory_id 
      })
      return updatedListing
   } catch (error) {
      throw errorHandler(error)
   }
}

module.exports = updateListing
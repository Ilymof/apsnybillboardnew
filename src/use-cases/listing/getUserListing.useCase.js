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

      console.log(listing)
      
      const {updated_at, expiration_days} = listing
      console.log('------', updated_at, expiration_days,'---------')
      
      const createdDate = new Date(updated_at)
      const expiresAt = new Date(createdDate.getTime() + expiration_days * 24 * 60 * 60 * 1000) 
      listing.expiresAt = expiresAt

      return listing
   } catch (error) {
      throw errorHandler(error)
   }
}

module.exports = getUserListing
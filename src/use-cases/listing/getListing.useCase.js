'use strict'

const ListingStorage = require('@storages/ListingStorage')
const errorHandler = require('@lib/errorHandler')

const getListing = async (queryParams) => {
   try {
      const { listingId } = queryParams || {} 
      if (!listingId) throw new Error('Listing ID is required')

      const listing = await ListingStorage.get(listingId)
      if (!listing) throw new Error('Listing not found')

      return listing
   } catch (error) {
      throw errorHandler(error)
   }
}

module.exports = getListing
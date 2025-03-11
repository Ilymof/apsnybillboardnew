'use strict'
const createListing = require('../use-cases/listing/createListing.useCase')
const getListings = require('../use-cases/listing/readListings.useCase')

module.exports = {
   async read(queryParams) {
      return await getListings(queryParams)
   },
   async create(listing, accessToken) {
      return await createListing(listing, accessToken)
   }
}

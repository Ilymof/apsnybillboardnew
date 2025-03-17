'use strict'

const createListing = require('../use-cases/listing/createListing.useCase')
const getListings = require('../use-cases/listing/readListings.useCase')
const updateListing = require('../use-cases/listing/updateListing.useCase')
const deleteListing = require('../use-cases/listing/deleteListing.useCase')
const getListing = require('../use-cases/listing/getListing.useCase')
const getUserListing = require('../use-cases/listing/getUserListing.useCase')
const getUserListings = require('../use-cases/listing/getUserListings.useCase')
module.exports = {
   async read(queryParams) {
      return await getListings(queryParams)
   },
   async create(listing, accessToken) {
      return await createListing(listing, accessToken)
   },
   async update(listingData, accessToken) {
      return await updateListing(listingData, accessToken)
   },
   async delete(listingData, accessToken) {
      return await deleteListing(listingData, accessToken)
   },
   async get(queryParams) {
      return await getListing(queryParams)
   },
   async userlisting(queryParams, accessToken) {
      return await getUserListing(queryParams, accessToken)
   },
   async userlistings(queryParams, accessToken) {
      return await getUserListings(queryParams, accessToken)
   }
}
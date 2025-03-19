'use strict'

const createListing = require('../use-cases/listing/createListing.useCase')
const getListings = require('../use-cases/listing/readListings.useCase')
const updateListing = require('../use-cases/listing/updateListing.useCase')
const deleteListing = require('../use-cases/listing/deleteListing.useCase')
// const getListing = require('../use-cases/listing/getListing.useCase')
const getUserListing = require('../use-cases/listing/getUserListing.useCase')
const getUserListings = require('../use-cases/listing/getUserListings.useCase')
const extendListing = require('../use-cases/listing/extendListing.useCase')

module.exports = {
   async read(queryParams) {
      return await getListings(queryParams)
   },
   async create(rawBody, accessToken) {
      return await createListing(rawBody, accessToken)
   },
   async update(rawBody, accessToken) {
      return await updateListing(rawBody, accessToken)
   },
   async delete(queryParams, accessToken) {
      return await deleteListing(queryParams, accessToken)
   },
   // async read(queryParams) {
   //    return await getListing(queryParams)
   // },
   async userlisting(queryParams, accessToken) {
      return await getUserListing(queryParams, accessToken)
   },
   async userlistings(queryParams, accessToken) {
      return await getUserListings(queryParams, accessToken)
   },
   async extend(rawBody, accessToken) {
      return await extendListing(rawBody, accessToken)
   }
}
const ListingStorage = require('../../storages/ListingStorage')
const ListingMapper = require('../../mappers/ListingMapper')
const ListingValidator = require('../../validators/ListindValidator')
const errorHandler = require('../../lib/errorHandler')


const getListings = async (queryParams) => {
   try {
      ListingValidator.validateQueryParams(queryParams)
      const rawRows = await ListingStorage.findByFilters(queryParams)
      return ListingMapper.transformListings(rawRows)
   } catch (error) {
      throw errorHandler(error)
   }
}
module.exports = getListings 
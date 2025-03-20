const ListingStorage = require('../../storages/ListingStorage')
const ListingMapper = require('../../mappers/ListingMapper')
const ListingValidator = require('../../validators/ListindValidator')
const errorHandler = require('../../lib/errorHandler')


const getListings = async (queryParams) => {
   try {
      ListingValidator.validateQueryParams(queryParams)
      const { listings: rawRows, total } = await ListingStorage.findByFilters(queryParams)
      const transformedListings = ListingMapper.transformListings(rawRows)
      return {
         listings: transformedListings,
         total: total
      }
   } catch (error) {
      throw errorHandler(error)
   }
}
module.exports = getListings 
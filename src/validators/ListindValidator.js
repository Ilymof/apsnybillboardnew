const { Schema } = require('metaschema')
const ValidationError = require('../lib/ValidationError')
const { title } = require('process')

const QuryParamsSchema = Schema.from(
   {
      id: { type: 'string', required: false },
      adName: {type: 'string', required: false},
      city: { type: 'string', required: false },
      category: { type: 'string', required: false },
      subcategory: { type: 'string', required: false },
      limit: { type: 'string', required: false },
      page: { type: 'string', required: false },
      minPrice: { type: 'string', required: false },
      maxPrice: { type: 'string', required: false },
      categoryPath: { type: 'string', required: false },
      subcategoryPath: { type: 'string', required: false }
   }
)


const validateQueryParams = (queryParams) => {
   const result = QuryParamsSchema.check(queryParams)
   if (!result.valid) throw ValidationError.invalidQueryParams(result.errors[0])
}

module.exports = {
   validateQueryParams
}
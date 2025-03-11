const { Schema } = require('metaschema')
const ValidationError = require('../lib/ValidationError')

const QuryParamsSchema = Schema.from(
   {
      id: { type: 'string', required: false },
      user_id: { type: 'string', required: false },
      city: { type: 'string', required: false },
      category: { type: 'string', required: false },
      subcategory: { type: 'string', required: false },
      limit: { type: 'string', required: false },
      page: { type: 'string', required: false },
      min_price: { type: 'string', required: false },
      max_price: { type: 'string', required: false }
   }
)


const validateQueryParams = (queryParams) => {
   const result = QuryParamsSchema.check(queryParams)
   if (!result.valid) throw ValidationError.invalidQueryParams(result.errors[0])
}

module.exports = {
   validateQueryParams
}
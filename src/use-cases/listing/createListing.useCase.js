const ListingStorage = require('@storages/ListingStorage')
const errorHandler = require('@lib/errorHandler')
const TokenService = require('@services/auth/JWTService')
const removeBearer = require('@lib/removeBearer')
const { processMultipart } = require('@lib/multipartParser')
const PermissionError = require('../../lib/PermeationError')


const createListing = async (rawBody, token) => {
   try {
      const clearToken = removeBearer(token)
      if (!clearToken) throw PermissionError.unauthorized()

      const decodedToken = TokenService.decodeToken(clearToken)
      if (!decodedToken) throw PermissionError.unauthorized()

      const userId = decodedToken.sub

      const boundary = rawBody.headers['content-type'].split('boundary=')[1]
      if (!boundary) throw new Error('Invalid multipart/form-data')

      const { fields, files } = await processMultipart(rawBody.body, boundary)

      const { title, description, price, city_id, category_id, subcategory_id,  telegram, whatsapp, phone, expiration_days } = fields
      const imagePaths = files.filter(f => f.name === 'images').map(f => f.filepath)

      if (!imagePaths.length) {
         throw new Error('At least one image is required')
      }

      const expDays = parseInt(expiration_days, 10)
      if (isNaN(expDays) || expDays < 1|| expDays > 30) {
         throw new Error('Кол-во дней должно быть  не больше 30')
      }

      const listing = {
         user_id: userId,
         city_id: city_id ? parseInt(city_id, 10) : null,
         category_id: category_id ? parseInt(category_id, 10) : null,
         subcategory_id: subcategory_id ? parseInt(subcategory_id, 10) : null,
         title,
         telegram: telegram || null ,
         whatsapp: whatsapp || null, 
         phone: phone || null,
         description,
         price: price ? parseFloat(price) : null,
         images: imagePaths, 
         created_at: new Date(),
         expiration_days: expDays
      }

      return await ListingStorage.create(listing)
   } catch (error) {
      throw errorHandler(error)
   }
}

module.exports = createListing
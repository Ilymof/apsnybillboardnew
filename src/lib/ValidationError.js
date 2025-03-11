const AppError = require('./AppError')

class ValidationError extends AppError {
   constructor(message, detail = null) {
      super({
         type: 'validation',
         message,
         detail,
         toClient: true,
         toLogs: false
      })
   }

   static missingBody() {
      return new ValidationError('Request body is missing')
   }

   static invalidQueryParams(detail) {
      return new ValidationError('Invalid query parameters', detail)
   }

   static invalidPathParams(detail) {
      return new ValidationError('Invalid path parameters', detail)
   }

   static missingField(field) {
      return new ValidationError('Missing required field', field)
   }

   static invalidField(field, reason) {
      return new ValidationError('Invalid field value', `Field "${field}" is invalid: ${reason}`)
   }

   static duplicateValue(field) {
      return new ValidationError('Duplicate value', `Field "${field}" is already in use`)
   }
}

module.exports = ValidationError

const AppError = require('./AppError')

class PermissionError extends AppError {
   constructor(message, detail = null) {
      super({
         type: 'permission',
         message,
         detail,
         toClient: true,
         toLogs: false
      })
   }

   static unauthorized() {
      return new PermissionError('Unauthorized access')
   }

   static forbiddenAction(detail) {
      return new PermissionError('Forbidden action', detail)
   }

   static insufficientRole(role) {
      return new PermissionError('Insufficient permissions', `Required role: ${role}`)
   }

   static accountBlocked() {
      return new PermissionError('Account is blocked')
   }
}

module.exports = PermissionError

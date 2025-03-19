'use strict'

const db = require('../../db')('users')
const PermissionError = require('../../lib/PermeationError.js')
const restrictAccess = require('../../lib/restrictAccess.js')
const ValidationError = require('../../lib/ValidationError.js')
const AppError = require('../../lib/AppError.js')

const banUser = async (args, token) => {
   if (!args) {
      throw ValidationError.missingBody()
   }
 
   const { userId } = args
   if (!userId) {
      throw ValidationError.missingField('userId')
   }
   const user = restrictAccess(token, '/api/admin/ban')
   if (user.role < 1) {
      throw PermissionError.insufficientRole('moderator or admin')
   }

   const result = await db.query(
      'UPDATE users SET is_blocked = TRUE, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id, full_name, is_blocked',
      [userId]
   )

   if (!result.rows.length) {
      throw new AppError({
         type: 'not_found',
         message: 'User not found',
         toClient: true,
         toLogs: true
      })
   }

   return { success: true, user: result.rows[0] }
}

module.exports = banUser 
'use strict'

const TokenService = require('@services/auth/JWTService')
const removeBearer = require('@lib/removeBearer')
const PermissionError = require('../lib/PermeationError')
const { ACCESS_CONTROL } = require('../roles')

const restrictAccess = (token, url) => {
   const decoded = TokenService.decodeToken(removeBearer(token)) 
   const userRole = decoded?.role ?? -1
   const cleanUrl = url.split('?')[0]
   const allowedRoles = ACCESS_CONTROL[cleanUrl] || []
   const isBlocked = decoded.is_blocked

   if (!decoded) {
      throw PermissionError.unauthorized()
   }

   if (isBlocked) {
      throw PermissionError.accountBlocked()
   }

   if (allowedRoles.length && !allowedRoles.includes(userRole)) {
      throw PermissionError.forbiddenAction(`Endpoint ${cleanUrl} requires one of: ${allowedRoles.join(', ')}`)
   }

   return { id: decoded.sub, role: userRole }
}

module.exports = restrictAccess
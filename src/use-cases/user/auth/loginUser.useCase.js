'use strict'
const AuthValidator = require('../../../validators/AuthValidator')
const AuthService = require('../../../services/auth/TelegramService')
const UserStorage = require('../../../storages/UserStorege')
const ValidationError = require('../../../lib/ValidationError')
const PermissionError = require('../../../lib/PermeationError')
const TokenService = require('../../../services/auth/JWTService')
const TokenStorage = require('../../../storages/TokenStorage')
const errorHandler = require('../../../lib/errorHandler')
const removeBearer = require('@lib/removeBearer')
const jwt = require('jsonwebtoken')




const loginUser = async (authCredentials) => {
   try {
      validateAuthCredentials(authCredentials)
      verifyTelegramHash(authCredentials)
      const userAccount = await getOrCreateUserAccount(authCredentials)
      const userId = userAccount.id
      const userRole = userAccount.role 
      const isBlocked = userAccount.is_blocked
      checkUserNotBlocked(userAccount)
      return await generateAndStoreTokens(userId, userRole, isBlocked, authCredentials)
   } catch (error) {
      throw errorHandler(error)
   }
}

const validateAuthCredentials = (authCredentials) => {
   const result = AuthValidator.login(authCredentials)
   if (!result.valid) {
      throw ValidationError.missingField(result.errors[0])
   }
}

const verifyTelegramHash = (authCredentials) => {
   if (!AuthService.verifyTelegramHash(authCredentials)) {
      throw ValidationError.missingField('Hash mismatch')
   }
}

const getOrCreateUserAccount = async (authCredentials) => {
   const {user} = authCredentials

   const userAccount = await UserStorage.getUserByProviderAndId(user.id)

   if (!userAccount) {
      return UserStorage.insertOrUpdateUser(authCredentials)
   }

   const currentFullName = userAccount.full_name
   const newFullName = `${user.first_name} ${user.last_name || ''}`.trim()

   if (currentFullName !== newFullName) {
      return UserStorage.insertOrUpdateUser(authCredentials)
   }

   return userAccount
}

const generateAndStoreTokens = async (userId, userRole, isBlocked, authCredentials) => {
   const { auth_provider, ip, user, useragent } = authCredentials
   
   const payload = {
      sub: userId, 
      role: userRole,
      is_blocked: isBlocked,
      auth_provider: auth_provider, 
      provider_user_id: user.id
   }
   const tokens = TokenService.generateTokens(payload)
   await TokenStorage.setToken(userId, ip, useragent, tokens.refreshToken)
   return tokens
   
}

const checkUserNotBlocked = (userAccount) => {
   if (userAccount.is_blocked)
      throw PermissionError.accountBlocked()
}

const toRefreshToken = async (refreshTokenData) => {
   try {
      const refreshToken = refreshTokenData.refreshToken 
      if (!refreshToken || typeof refreshToken !== 'string') {
         throw ValidationError.missingField('Refresh token must be a string')
      }
      const decoded = TokenService.verifyRefreshToken(refreshToken)
      if (!decoded) {
         throw ValidationError.missingField('Invalid or expired refresh token')
      }

      const storedToken = await TokenStorage.getToken(decoded.sub, decoded.user_ip)
      if (!storedToken || storedToken !== refreshToken) {
         throw ValidationError.missingField('Refresh token not found or mismatched')
      }

      const tokens = TokenService.refreshAccessToken(refreshToken)
      return tokens
   } catch (error) {
      throw errorHandler(error)
   }
}
const logoutUser = async (refreshTokenData) => {
   try {
      const refreshToken = refreshTokenData.refreshToken 
      if (!refreshToken || typeof refreshToken !== 'string') {
         throw ValidationError.missingField('Refresh token must be a string')
      }
      const decoded = jwt.decode(refreshToken)
      if (!decoded || !decoded.sub) {
         throw ValidationError.missingField('Invalid refresh token format')
      }
      const storedToken = await TokenStorage.getToken(decoded.sub, refreshToken)
      if (!storedToken || storedToken !== refreshToken) {
         throw ValidationError.missingField('Refresh token not found or mismatched')
      }

      await TokenStorage.deleteToken(decoded.sub, refreshToken)
      return { success: true, message: 'Logged out successfully' }
   } catch (error) {
      throw errorHandler(error)
   }
}
const check = async (queryParams,token) => {
   
   const clearToken = removeBearer(token)
   if (!clearToken) throw PermissionError.unauthorized()
   const decodedToken = TokenService.verifyAccessToken(clearToken)
   let is_alive = false
   if(decodedToken){
      is_alive =  true
   }
   return {
      is_alive: is_alive
   }

}

module.exports = { loginUser, toRefreshToken, logoutUser, check }

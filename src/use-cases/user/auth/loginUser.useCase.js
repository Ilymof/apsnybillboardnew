'use strict'
const AuthValidator = require('../../../validators/AuthValidator')
const AuthService = require('../../../services/auth/TelegramService')
const UserStorage = require('../../../storages/UserStorege')
const ValidationError = require('../../../lib/ValidationError')
const PermissionError = require('../../../lib/PermeationError')
const TokenService = require('../../../services/auth/JWTService')
const TokenStorage = require('../../../storages/TokenStorage')
const errorHandler = require('../../../lib/errorHandler')




const loginUser = async (authCredentials) => {
   try {
      validateAuthCredentials(authCredentials)
      verifyTelegramHash(authCredentials)
      const userAccount = await getOrCreateUserAccount(authCredentials)
      const userId = userAccount.id
      checkUserNotBlocked(userAccount)
      return await generateAndStoreTokens(userId, authCredentials)
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
   const { auth_provider, user } = authCredentials
   const userAccount = await UserStorage.getUserByProviderAndId(auth_provider, user.id)

   if (userAccount) return userAccount
   return UserStorage.insertOrUpdateUser(authCredentials)
}

const generateAndStoreTokens = async (userId, authCredentials) => {
   const { auth_provider, user } = authCredentials
   
   const payload = {
      sub: userId, 
      auth_provider: auth_provider, 
      provider_user_id: user.id
   }

   const tokens = TokenService.generateTokens(payload)

   await TokenStorage.deleteToken(userId)
   await TokenStorage.setToken(userId, tokens.refreshToken)
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

      const storedToken = await TokenStorage.getToken(decoded.sub)
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
      const decoded = TokenService.verifyRefreshToken(refreshToken)
      if (!decoded) {
         throw ValidationError.missingField('Invalid or expired refresh token')
      }
      const storedToken = await TokenStorage.getToken(decoded.sub)
      if (!storedToken || storedToken !== refreshToken) {
         throw ValidationError.missingField('Refresh token not found or mismatched')
      }

      await TokenStorage.deleteToken(decoded.sub)
      return { success: true, message: 'Logged out successfully' }
   } catch (error) {
      throw errorHandler(error)
   }
}

module.exports = { loginUser, toRefreshToken, logoutUser }

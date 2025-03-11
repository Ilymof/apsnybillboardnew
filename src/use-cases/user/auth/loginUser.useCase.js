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

   if (userAccount) userAccount
   return UserStorage.insertOrUpdateUser(authCredentials)
}

const generateAndStoreTokens = async (userId, authCredentials) => {
   const { auth_provider, user } = authCredentials
   const tokens = TokenService.generateTokens({ auth_provider, id: user.id })

   await TokenStorage.deleteToken(userId)
   await TokenStorage.setToken(userId, tokens.refreshToken)
   return tokens
}

const checkUserNotBlocked = (userAccount) => {
   if (userAccount.is_bloked)
      throw PermissionError.accountBlocked()
}
module.exports = { loginUser }

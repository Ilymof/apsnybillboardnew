'use strict'
const AuthValidator = require('../../../validators/AuthValidator')
const AuthService = require('../../../services/auth/TelegramService')
const UserStorage = require('../../../storages/UserStorege')
const ValidationError = require('../../../lib/ValidationError')
const TokenService = require('../../../services/auth/JWTService')

module.exports = async (userData) => {
  const { auth_provider, user } = userData

  if (!AuthValidator.login(userData).valid)
    throw new ValidationError(AuthValidator.login(userData).errors[0])

  if (!AuthService.verifyTelegramHash(userData))
    throw new ValidationError('Hash mismatch')

  const userAccount = await UserStorage.getUserByProviderAndId(auth_provider, user.id)

  if (!userAccount.length) {
    const newUser = await UserStorage.insertOrUpdateUser(userData)
    let { auth_provider, provider_user_id } = newUser
    return TokenService.generateTokens({ auth_provider, provider_user_id })
  }
  return userAccount
}

// {
// 	ip: { type: 'string', required: true },
// 	useragent: { type: 'string', required: true },
// 	auth_provider: { type: 'enum', enum: ['telegram'], required: true },
// 	user: {
// 		auth_date: { type: 'number', required: true },
// 		first_name: { type: 'string', required: true },
// 		last_name: { type: 'string', required: false },
// 		hash: { type: 'string', required: true },
// 		id: { type: 'number', required: true },
// 		photo: { type: 'string', required: false },
// 		username: { type: 'string', required: false },
// 	}
// }
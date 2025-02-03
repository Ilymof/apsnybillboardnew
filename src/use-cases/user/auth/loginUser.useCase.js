'use strict'
const AuthValidator = require('../../../validators/AuthValidator')
const AuthService = require('../../../services/auth/TelegramService')
const UserStorage = require('../../../storages/UserStorege')
const ValidationError = require('../../../lib/ValidationError')
const TokenService = require('../../../services/auth/JWTService')
const TokenStorage = require('../../../storages/TokenStorage')
const errorHandler = require('../../../lib/errorHandler')

module.exports = async (userData) => {
  try {
    const { auth_provider, user } = userData;
    const validationResult = AuthValidator.login(userData);

    if (!validationResult.valid)
      throw new ValidationError(validationResult.errors[0]);

    if (!AuthService.verifyTelegramHash(userData))
      throw new ValidationError("Hash mismatch");

    const userAccount = await UserStorage.getUserByProviderAndId(auth_provider, user.id);
    let userId;

    if (!userAccount) {
      const newUser = await UserStorage.insertOrUpdateUser(userData);
      userId = newUser.id;
    } else {
      userId = userAccount.id;
    }

    const tokens = TokenService.generateTokens({ auth_provider, id: user.id });
    await TokenStorage.deleteToken(userId)
    await TokenStorage.setToken(userId, tokens.refreshToken);
    return tokens;
  } catch (error) {
    throw errorHandler(error)
  }
};


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
'use strict'
const AuthValidator = require('../validators/AuthValidator')
const AuthService = require('../services/auth/TelegramService')
const UserStorage = require('../storages/UserStorege')
const jwt = require('jsonwebtoken');
const { pipe } = require('fp-ts/lib/function')
const E = require('fp-ts/lib/Either')
const TE = require('fp-ts/lib/TaskEither')

module.exports = {
	async login(userData) {
		return pipe(
			userData,
			E.fromNullable('Ошибка: userData отсутствует'),
			E.chain(AuthValidator.login),
			E.chain(AuthService.verifyTelegramHash),
			E.chain((user) => {
				return UserStorage.getUserByProviderAndId(user.auth_provider, user.user.id)
			})
		)
	}
};



// TE.fold(
// 	(e) => console.log(e),
// 	(r) => consolr.log(r),
// )
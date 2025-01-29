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
		const result = pipe(
			userData,
			E.fromNullable('Ошибка: userData отсутствует'),
			E.chain(AuthValidator.login),
			E.chain(AuthService.verifyTelegramHash),
			TE.fromEither,
			TE.chain((user) => {
				return UserStorage.getUserByProviderAndId(user.auth_provider, user.user.id);
			})
		)

		return result().then(E.fold(
			(error) => console.error('Ошибка:', error),
			(success) => console.log('Результат:', success)
		))
	}
};



// TE.fold(
// 	(e) => console.log(e),
// 	(r) => consolr.log(r),
// )
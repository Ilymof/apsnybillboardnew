'use strict'
const pipe = require('../lib/pipe')
const AuthValidator = require('../validators/AuthValidator')
const E = require('../lib/either')
const AuthService = require('../services/auth/TelegramService')
const UserStorage = require('../storages/UserStorege')

module.exports = {
	async login(data) {
		return pipe(
			E.fromNullable,
			E.chain(AuthValidator.login),
			E.chain(AuthService.verifyTelegramHash),
			E.chain(async body => {
				const user = await UserStorage.getUserByProviderAndId(body.provider, body.id).run()
				return E.fold(E.Left, user => E.of({ user, body }))(user)
			}),
			E.chain(({ user, body }) => {
				console.dir({ user, body })
				return body
			})
		)(data)
	}
}
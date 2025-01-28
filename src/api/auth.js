'use strict'
const pipe = require('../lib/pipe')
const AuthValidator = require('../validators/AuthValidator')
const E = require('../lib/either')
const AuthService = require('../services/auth/TelegramService')


module.exports = {
	async login(data) {
		return pipe(
			E.fromNullable,
			E.chain(AuthValidator.login),
			E.chain(AuthService.verifyTelegramHash),
			E.fold(
				(error) => console.log(error),
				(value) => console.log(value)
			)
		)(data)
	}
}
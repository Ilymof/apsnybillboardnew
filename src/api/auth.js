'use strict'
const loginUseCase = require('../use-cases/user/auth/loginUser.useCase')

module.exports = {
	async login(userData) {
		return await loginUseCase(userData)
	}
};


const { either } = require('../lib/either.js')
const { LoginSchema } = require('../shemas/auth.js')

module.exports = {
	login(input) {
		const result = LoginSchema.check(input)
		if (!result.valid) return either.Left(result.errors)
		return either.Right(input)
	}
}
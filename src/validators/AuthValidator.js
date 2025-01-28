const E = require('../lib/either.js')
const { LoginSchema } = require('../shemas/auth.js')

module.exports = {
	login(input) {
		const result = LoginSchema.check(input)
		if (!result.valid) return E.Left(result.errors)
		return E.Right(input)
	}
}
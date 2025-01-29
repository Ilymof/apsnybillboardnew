const { LoginSchema } = require('../shemas/auth.js')
const E = require('fp-ts/lib/Either')
module.exports = {
	login(input) {
		const result = LoginSchema.check(input)
		if (!result.valid) return E.left(result.errors)
		return E.right(input)
	}
}
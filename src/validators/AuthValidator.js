const { LoginSchema } = require('../shemas/auth.js')
module.exports = {
	login(input) {
		const result = LoginSchema.check(input)
		return result
	}
}
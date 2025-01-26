const either = require('../lib/either.js')

module.exports = {
	loginSchema(input) {
		const schema = {
			ip: 'string',
			useragent: 'string',
			auth_provider: 'string',
			provider_user_id: 'string',
			full_name: 'string',
			hash: 'string'
		};

		if (typeof input !== 'object' || input === null) {
			return either.Left('Пиздец котенку')
		}

		for (const key in schema) {
			if (!(key in input)) {
				return either.Left('Пиздец котенку')
			}
			if (typeof input[key] !== schema[key]) {
				return either.Left('Пиздец котенку')
			}
		}
		return either.Right
	}
}
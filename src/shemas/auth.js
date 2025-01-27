const { Schema } = require('metaschema');

const LoginSchema = Schema.from({
	ip: { type: 'string', required: true },
	useragent: { type: 'string', required: true },
	auth_provider: { type: 'enum', enum: ['telegram'], required: true },
	provider_user_id: { type: 'number', required: true },
	full_name: { type: 'string', required: true },
	hash: { type: 'string', required: true },
})
module.exports = { LoginSchema };

const { Schema } = require('metaschema')

const LoginSchema = Schema.from({
   ip: { type: 'string', required: true },
   useragent: { type: 'string', required: true },
   auth_provider: { type: 'enum', enum: ['telegram'], required: true },
   user: {
      auth_date: { type: 'number', required: true },
      first_name: { type: 'string', required: true },
      last_name: { type: 'string', required: false },
      hash: { type: 'string', required: true },
      id: { type: 'number', required: true },
      photo_url: { type: 'string', required: false },
      username: { type: 'string', required: false }
   }
})
module.exports = { LoginSchema }

const { Schema } = require('metaschema');

const CreateCityShema = Schema.from({
  name: { type: 'string', required: true },
})
const UpdateCityShema = Schema.from({
  id: { type: 'number', required: true },
  name: { type: 'string', required: true },
})
module.exports = { CreateCityShema, UpdateCityShema };

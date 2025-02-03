const { Schema } = require('metaschema');

const CreateCategoryShema = Schema.from({
  name: { type: 'string', required: true },
  image: {type: 'string', required: true},
  path: { type: 'string', required: true }
})
const UpdateCategoryShema = Schema.from({
  id: { type: 'number', required: true },
  name: { type: 'string', required: true },
  image: {type: 'string', required: true},
  path: { type: 'string', required: true }
})
module.exports = { CreateCategoryShema, UpdateCategoryShema };

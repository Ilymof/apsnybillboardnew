const { Schema } = require('metaschema');

const CreateSubcategoryShema = Schema.from({
  name: { type: 'string', required: true },
  categoryid: {type: 'number', required: true},
  path: { type: 'string', required: true }
})
const UpdateSubcategoryShema = Schema.from({
  id: { type: 'number', required: true },
  name: { type: 'string', required: true },
  categoryid: {type: 'number', required: true},
  path: { type: 'string', required: true }
})
module.exports = { CreateSubcategoryShema, UpdateSubcategoryShema };

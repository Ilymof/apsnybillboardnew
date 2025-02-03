'use strict'

const db = require('db.js')
const subcategories = db('subcategory')
const safeDbCall = require('../lib/safeDbCall')
const { CreateSubcategoryShema, UpdateSubcategoryShema } = require('../shemas/subcategory')
const errorHandler = require('../lib/errorHandler');
const ValidationError = require('../lib/ValidationError')

module.exports = {
  'read-all': async () => await safeDbCall(() => subcategories.read()),

  read: async ({ id }) => {
    if (!Number(id))
      throw errorHandler(new ValidationError('Ебанат id должен быть числом'))

    return await safeDbCall(() => subcategories.read(id))
  },

  create: async (data) => {
    if (!CreateSubcategoryShema.check(data).valid)
      throw errorHandler(new ValidationError(CreateSubcategoryShema.check(data).errors[0]))

    return await safeDbCall(() => subcategories.create(data))
  },

  update: async ({ id, name, categoryid, path }) => {
    if (!UpdateSubcategoryShema.check({ id, name, categoryid, path }).valid)
      throw errorHandler(new ValidationError(UpdateSubcategoryShema.check({ id, name, categoryid, path }).errors[0]))

    return await safeDbCall(() => subcategories.update(id, { name, categoryid, path }))
  },

  delete: async ({ id }) => {
    if (!Number(id))
      throw errorHandler(new ValidationError('Ебанат id должен быть числом'))

    return await safeDbCall(() => subcategories.delete(id))
  },
};

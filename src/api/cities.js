'use strict';

const db = require('db.js');
const cities = db('city');
const errorHandler = require('../lib/errorHandler');
const ValidationError = require('../lib/ValidationError')
const { CreateCityShema, UpdateCityShema } = require('../shemas/city')

// Надо, наверное вынести в lib
const safeDbCall = async (fn, ...args) => {
  try {
    return await fn(...args);
  } catch (error) {
    throw errorHandler(error);
  }
};

module.exports = {
  'read-all': async () => await safeDbCall(() => cities.read()),

  read: async ({ id }) => {
    if (!Number(id))
      throw errorHandler(new ValidationError('Ебанат id должен быть числом'))

    return await safeDbCall(() => cities.read(id))
  },

  create: async (data) => {
    if (!CreateCityShema.check(data).valid)
      throw errorHandler(new ValidationError(CreateCityShema.check(data).errors[0]))

    return await safeDbCall(() => cities.create(data))
  },

  update: async ({ id, name }) => {
    if (!UpdateCityShema.check({ id, name }).valid)
      throw errorHandler(new ValidationError(UpdateCityShema.check({ id, name }).errors[0]))

    return await safeDbCall(() => cities.update(id, { name }))
  },

  delete: async ({ id }) => {
    if (!Number(id))
      throw errorHandler(new ValidationError('Ебанат id должен быть числом'))

    return await safeDbCall(() => cities.delete(id))
  },
};

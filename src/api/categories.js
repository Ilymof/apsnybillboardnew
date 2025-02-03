
const categoryStorage = require('storages/categoryStorage.js')
const UserMapper = require('mappers/UserMapper.js')
const { toCategoryContract } = UserMapper()
const db = require('db.js')
const categories = db('category')
const safeDbCall = require('../lib/safeDbCall')
const errorHandler = require('../lib/errorHandler');
const ValidationError = require('../lib/ValidationError')
const { CreateCategoryShema, UpdateCategoryShema } = require('../shemas/category')

module.exports = {

	'read-all': async () => {
		return await safeDbCall(async () => {
			const res = (await categoryStorage.getAll()).rows;
			return toCategoryContract(res);
		});
		},	

	read: async ({ id }) => {
		if (!Number(id))
			throw errorHandler(new ValidationError('Ебанат id должен быть числом'))
	
		return await safeDbCall(() => categories.read(id))
		},
	
	
	create: async (data) => {
		if (!CreateCategoryShema.check(data).valid)
		  throw errorHandler(new ValidationError(CreateCategoryShema.check(data).errors[0]))
	
		return await safeDbCall(() => categories.create(data))
	  },
	
	  update: async ({ id, name, path, image }) => {
		if (!UpdateCategoryShema.check({ id, name, path, image}).valid)
		  throw errorHandler(new ValidationError(UpdateCategoryShema.check({ id, name, path, image }).errors[0]))
	
		return await safeDbCall(() => categories.update(id, { name, path, image }))
	  },
	
	  delete: async ({ id }) => {
		if (!Number(id))
		  throw errorHandler(new ValidationError('Ебанат id должен быть числом'))
	
		return await safeDbCall(() => categories.delete(id))
	  },
}

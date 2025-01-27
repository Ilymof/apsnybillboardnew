
const { pipe } = require('../lib/pipe.js')
const categoryStorage = require('storages/categoryStorage.js')
const UserMapper = require('mappers/UserMapper.js')
const { toCategoryContract } = UserMapper()

module.exports = {
	async 'read-all'() {
		try {
			return pipe(
				(rawData) => rawData.rows,
				toCategoryContract
			)(
				await categoryStorage.getAll()
			)
		} catch (error) {
			console.error('Ошибка при выполнении запроса:', error);
			throw error;
		}
	}
}

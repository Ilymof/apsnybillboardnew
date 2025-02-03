
const categoryStorage = require('storages/categoryStorage.js')
const UserMapper = require('mappers/UserMapper.js')
const { toCategoryContract } = UserMapper()
const db = require('db.js')
const categories = db('category')

module.exports = {
	async 'read-all'() {
		try {
			const res = (await categoryStorage.getAll()).rows
			return toCategoryContract(res)

		} catch (error) {
			console.error('Ошибка при выполнении запроса:', error);
		}
	},
	async 'read'({ id }) {
		return (await categories.read(id));
	},

	async 'create'(data) {
		await categories.create(data);
	},

	async 'update'(id, data) {
		await categories.update(id, data);
	},

	async 'delete'({ id }) {
		await categories.delete(id);
	},
}

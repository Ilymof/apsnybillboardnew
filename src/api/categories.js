'use strict'

const db = require('../db.js')
const UserMapper = require('../mappers/UserMapper.js')
const { toCategoryContract } = UserMapper()
const category = db('category')



module.exports = {
	async read() {
		const sql = `
		SELECT 
			c.id AS category_id,
			c.name AS category_name,
			c.path AS category_path,
			c.image AS category_image,
			s.id AS subcategory_id,
			s.name AS subcategory_name,
			s.path AS subcategory_path
		FROM 
			category c
		LEFT JOIN 
			subcategory s
		ON 
			c.id = s.categoryId;
		`
		try {
			const { rows } = await category.query(sql);
			return toCategoryContract(rows);
		} catch (err) {
			console.error('Ошибка при выполнении запроса:', err);
			throw err;
		}
	}
}
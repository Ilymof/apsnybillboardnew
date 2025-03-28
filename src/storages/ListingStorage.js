/* eslint-disable no-mixed-spaces-and-tabs */
'use strict'
const db = require('../db.js')
const listings = db('listings')
const safeDbCall = require('../lib/safeDbCall')
const { createCondition } = require('../lib/queryConditions')
const SqlQueryBuilder = require('../lib/SqlQueryBuilder.js')

const readSql = `
	SELECT 
		l.id AS listing_id,
		l.title, 
		l.description,
		l.price,
		l.images,
		l.created_at,
      l.updated_at,
      l.expiration_days,
      l.telegram,
      l.whatsapp,
      l.phone,

		u.id AS author_id,
		u.full_name AS author_name,
		u.phone AS author_phone,
		u.telegram AS author_telegram,
		u.whatsapp AS author_whatsapp,

		cat.id AS category_id,
		cat.name AS category_name,
		cat.path AS category_path,
		cat.image AS category_image,

		c.name AS city,
      c.id AS city_id,

		sub.id AS subcategory_id,
		sub.name AS subcategory_name,
		sub.path AS subcategory_path

	FROM listings l
	LEFT JOIN users u ON l.user_id = u.id
	LEFT JOIN city c ON l.city_id = c.id
	LEFT JOIN category cat ON l.category_id = cat.id
	LEFT JOIN subcategory sub ON l.subcategory_id = sub.id
`


module.exports = { 
   async findByFilters(queryParams) {
      const conditions = [
         (p) => p.adName && createCondition('l.title', 'ILIKE', `%${p.adName}%`),
         (p) => p.id && createCondition('l.id', '=', p.id),
         (p) => p.city && createCondition('c.id', '=', p.city),
         (p) => p.categoryPath && createCondition('cat.path', '=', p.categoryPath),
         (p) => p.subcategoryPath && createCondition('sub.path', '=', p.subcategoryPath),
         (p) => p.minPrice && createCondition('l.price', '>=', p.minPrice),
         (p) => p.maxPrice && createCondition('l.price', '<=', p.maxPrice)
      ]

      // Формируем WHERE-условие отдельно
      const activeConditions = conditions.map(fn => fn(queryParams)).filter(Boolean)
      const whereClause = activeConditions.length 
         ? `WHERE ${activeConditions.map((_, i) => _.sql.replace('?', `$${i + 1}`)).join(' AND ')}` 
         : ''
      const values = activeConditions.map(c => c.value)

      // Запрос для получения данных с пагинацией
      const { sql: dataSql, values: dataValues } = new SqlQueryBuilder(readSql)
         .createWhere(conditions, queryParams)
         .createOrder('l.created_at', 'DESC')
         .createPagination(queryParams)
         .end()

      // Запрос для подсчета общего количества
      const countSql = `
         SELECT COUNT(*) as total 
         FROM listings l
         LEFT JOIN city c ON l.city_id = c.id
         LEFT JOIN category cat ON l.category_id = cat.id
         LEFT JOIN subcategory sub ON l.subcategory_id = sub.id
         ${whereClause}
      `.trim()

      const [dataResult, countResult] = await Promise.all([
         safeDbCall(() => listings.query(dataSql, dataValues)),
         safeDbCall(() => listings.query(countSql, values))
      ])

      return {
         listings: dataResult.rows,
         total: parseInt(countResult.rows[0].total)
      }
   },
   async create(listing) {
      return (await safeDbCall(() => listings.create(listing)))
   },
   
   async get(listingId)  {
      const sql = `${readSql} WHERE l.id = $1`
      const values = [listingId]
      const result = await safeDbCall(() => listings.query(sql, values))
      return result.rows[0]
   },

   async update(listingId, updateData) {
      const listing = await this.get(listingId)
      if (!listing) {
         throw new Error('Listing not found')
      }

      const {
         title,
         description,
         price,
         images,
         city_id,
         category_id,
         subcategory_id,
         telegram,
         whatsapp,
         phone,
         expiration_days,
         updated_at
      } = updateData

      const fieldsToUpdate = []
      const values = []
      let paramIndex = 1

      if (title !== undefined && title !== null) {
         fieldsToUpdate.push(`title = $${paramIndex}`)
         values.push(title)
         paramIndex++
      }
      if (description !== undefined && description !== null) {
         fieldsToUpdate.push(`description = $${paramIndex}`)
         values.push(description)
         paramIndex++
      }
      if (telegram !== undefined && telegram !== null) {
         fieldsToUpdate.push(`telegram = $${paramIndex}`)
         values.push(telegram)
         paramIndex++
      }
      if (whatsapp !== undefined && whatsapp !== null) {
         fieldsToUpdate.push(`whatsapp = $${paramIndex}`)
         values.push(whatsapp)
         paramIndex++
      }
      if (phone !== undefined && phone !== null) {
         fieldsToUpdate.push(`phone = $${paramIndex}`)
         values.push(phone)
         paramIndex++
      }
      if (images !== undefined && images !== null) {
         fieldsToUpdate.push(`images = $${paramIndex}`)
         values.push(images)
         paramIndex++
      }

      // Числовые поля с проверкой
      if (price !== undefined && price !== null && !isNaN(Number(price))) {
         fieldsToUpdate.push(`price = $${paramIndex}`)
         values.push(Number(price)) 
         paramIndex++
      }
      if (city_id !== undefined && city_id !== null && !isNaN(Number(city_id))) {
         fieldsToUpdate.push(`city_id = $${paramIndex}`)
         values.push(Number(city_id)) 
         paramIndex++
      }
      if (category_id !== undefined && category_id !== null && !isNaN(Number(category_id))) {
         fieldsToUpdate.push(`category_id = $${paramIndex}`)
         values.push(Number(category_id)) 
         paramIndex++
      }
      if (subcategory_id !== undefined && subcategory_id !== null && !isNaN(Number(subcategory_id))) {
         fieldsToUpdate.push(`subcategory_id = $${paramIndex}`)
         values.push(Number(subcategory_id)) 
         paramIndex++
      }
      if (expiration_days !== undefined && expiration_days !== null && !isNaN(Number(expiration_days))) {
         fieldsToUpdate.push(`expiration_days = $${paramIndex}`)
         values.push(Number(expiration_days)) 
         paramIndex++
      }
      if (updated_at !== undefined && updated_at !== null) {
         fieldsToUpdate.push(`updated_at = $${paramIndex}`)
         values.push(updated_at)
         paramIndex++
      }

      if (fieldsToUpdate.length === 0) {
         return listing
      }

      values.push(listingId)

      const sql = `
         UPDATE listings
         SET ${fieldsToUpdate.join(', ')}
         WHERE id = $${paramIndex}
         RETURNING *
      `

      console.log('SQL:', sql)
      console.log('Values:', values)

      const result = await safeDbCall(() => listings.query(sql, values))
      return result.rows[0]
   },

   async delete(listingId, userId) {
      const listing = await this.get(listingId)
      if (!listing) {
	   throw new Error('Listing not found')
      }

      const sql = 'DELETE FROM listings WHERE id = $1 AND user_id = $2 RETURNING *'
      const values = [listingId, userId]
      const result = await safeDbCall(() => listings.query(sql, values))
      return result.rows[0]
   },
   async getAllUserListings(userId) {
      const dataSql = `
         ${readSql}
         WHERE l.user_id = $1
         ORDER BY l.created_at DESC
      `
      const countSql = `
         SELECT COUNT(*) as total 
         FROM listings l
         WHERE l.user_id = $1
      `
      const values = [userId]

      const [dataResult, countResult] = await Promise.all([
         safeDbCall(() => listings.query(dataSql, values)),
         safeDbCall(() => listings.query(countSql, values))
      ])

      return {
         listings: dataResult.rows,
         total: parseInt(countResult.rows[0].total)
      }
   }
}
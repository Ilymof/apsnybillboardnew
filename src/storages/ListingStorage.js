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
   async findByFilters(queryParams){
      
      const conditions = [
         (p) => p.id && createCondition('l.id', '=', p.id),
         (p) => p.user_id && createCondition('l.user_id', '=', p.user_id),
         (p) => p.city && createCondition('c.name', 'ILIKE', p.city, true),
         (p) => p.category && createCondition('cat.id', '=', p.category),
         (p) => p.subcategory && createCondition('sub.id', '=', p.subcategory),
         (p) => p.min_price && createCondition('l.price', '>=', p.min_price),
         (p) => p.max_price && createCondition('l.price', '<=', p.max_price)
      ]

      const { sql, values } = new SqlQueryBuilder(readSql)
         .createWhere(conditions, queryParams)
         .createOrder('l.created_at', 'DESC')
         .createPagination(queryParams)
         .end()

      return (await safeDbCall(() => listings.query(sql, values))).rows
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

   async update(listingId, userId, updateData)  {
      const listing = await this.get(listingId)
      if (!listing) {
         throw new Error('Listing not found')
      }
      if (listing.author_id !== userId) { // Используем author_id, так как это результат JOIN
         throw new Error('Unauthorized: You are not the owner of this listing')
      }

      const { title, description, price, images, city_id, category_id, subcategory_id } = updateData
      const sql = `
	   UPDATE listings
	   SET 
		  title = COALESCE($1, title),
		  description = COALESCE($2, description),
		  price = COALESCE($3, price),
		  images = COALESCE($4, images),
		  city_id = COALESCE($5, city_id),
		  category_id = COALESCE($6, category_id),
		  subcategory_id = COALESCE($7, subcategory_id)
	   WHERE id = $8 AND user_id = $9
	   RETURNING *
	`
      const values = [
         title, 
		 description, 
		 price, 
		 images, 
		 city_id, 
		 category_id, 
		 subcategory_id, 
		 listingId, 
		 userId
      ]
	  const result = await safeDbCall(() => listings.query(sql, values))
	  return result.rows[0]
   },

   async delete(listingId, userId) {
      const listing = await this.get(listingId)
      if (!listing) {
	   throw new Error('Listing not found')
      }
      if (listing.author_id !== userId) {
	   throw new Error('Unauthorized: You are not the owner of this listing')
      }

      const sql = 'DELETE FROM listings WHERE id = $1 AND user_id = $2 RETURNING *'
      const values = [listingId, userId]
      const result = await safeDbCall(() => listings.query(sql, values))
      return result.rows[0]
   },
   async getAllUserListings(userId) {
      const sql = `
         ${readSql}
         WHERE l.user_id = $1
         ORDER BY l.created_at DESC;
      `
      const values = [userId]
      return (await safeDbCall(() => listings.query(sql, values))).rows
   }
}
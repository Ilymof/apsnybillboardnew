'use strict'

const db = require('../db.js')
const category = db('category')

module.exports = {
  async getAll() {
    try {
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
      return await category.query(sql);
    } catch (error) {
      console.error('Базе плохо')
    }
  }
}
'use strict'

const db = require('../db.js')


async function getCategoriesWithSubcategory(req, res) {
            const sql = `
            SELECT 
                category.id,
                category.name,
                category.path,
                category.image,
                subcategory.id,
                subcategory.name,
                subcategory.path
            FROM 
                category
            LEFT JOIN 
                subcategory
            ON 
                category.id = subcategory.categoryId
            ORDER BY 
                category.id, subcategory.id;
        `;

        const result = await pool.query(sql);
        const rows = result.rows;

        // Преобразуем строки в структуру "категории с подкатегориями"
        const categories = [];
        const categoryMap = {};

        for (const row of rows) {
            // Проверяем, добавлена ли категория
            if (!categoryMap[row.id]) {
                categoryMap[row.id] = {
                    id: row.id,
                    name: row.name,
                    path: row.path,
                    image: row.image || null,
                    subcategories: []
                };
                categories.push(categoryMap[row.id]);
            }

            // Добавляем подкатегорию, если она существует (id подкатегории не null)
            if (row['subcategory.id']) {
                categoryMap[row.id].subcategories.push({
                    id: row['subcategory.id'],          
                    name: row['subcategory.name'],      
                    path: row['subcategory.path']      
                });
            }
        }

        return categories;
}

module.exports = db('category')

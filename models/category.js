const pool = require('../config/database');

const createCategoryTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS categories (
            id SERIAL PRIMARY KEY,
            category_name VARCHAR(255) UNIQUE NOT NULL,
            path VARCHAR(255) UNIQUE NOT NULL
        );
    `;
    try {
        await pool.query(query);
    } catch (err) {
        console.error('Ошибка создания таблицы categories:', err);
    }
};

const alterAdTableAddCategory = async () => {
    const query = `
        ALTER TABLE ads ADD COLUMN category_id INTEGER,
        ADD CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES categories (id);
    `;
    await pool.query(query);
};

module.exports = { createCategoryTable, alterAdTableAddCategory };
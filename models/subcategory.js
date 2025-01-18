const pool = require('../config/database');

const createSubcategoryTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS subcategories (
            id SERIAL PRIMARY KEY,
            subcategory_name VARCHAR(255) NOT NULL,
            category_id INTEGER NOT NULL,
            path VARCHAR(255) UNIQUE NOT NULL,
            FOREIGN KEY (category_id) REFERENCES categories (id)
        );
    `;
    try {
        await pool.query(query);
        console.log('Таблица subcategories создана.');
    } catch (err) {
        console.error('Ошибка создания таблицы subcategories:', err);
    }
};

const alterAdTableAddSubcategory = async () => {
    const query = `
        ALTER TABLE ads ADD COLUMN subcategory_id INTEGER,
        ADD CONSTRAINT fk_subcategory FOREIGN KEY (subcategory_id) REFERENCES subcategories (id);
    `;
    await pool.query(query);
};

module.exports = {createSubcategoryTable, alterAdTableAddSubcategory};
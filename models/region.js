
const pool = require('../config/database');

const createRegionTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS regions (
            id SERIAL PRIMARY KEY,
            region_name VARCHAR(255) NOT NULL
        );
    `;
    try {
        await pool.query(query);
    } catch (err) {
        console.error('Ошибка создания таблицы regions:', err);
    }
};

const alterAdTableAddRegion = async () => {
    const query = `
        ALTER TABLE ads ADD COLUMN region_id INTEGER,
        ADD CONSTRAINT fk_region FOREIGN KEY (region_id) REFERENCES regions (id);
    `;
    await pool.query(query);
};

module.exports = {createRegionTable, alterAdTableAddRegion};
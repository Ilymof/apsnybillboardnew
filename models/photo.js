const pool = require('../config/database');

const createPhotoTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS photos (
            id SERIAL PRIMARY KEY,
            url VARCHAR(255) NOT NULL,
            ad_id INTEGER NOT NULL,
            FOREIGN KEY (ad_id) REFERENCES ads (id) ON DELETE CASCADE
        );
    `;
    try {
        await pool.query(query);
    } catch (err) {
        console.error('Ошибка создания таблицы photos:', err);
    }
};

module.exports = {createPhotoTable};
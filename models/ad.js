const pool = require('../config/database');

const createAdTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS ads (
            id SERIAL PRIMARY KEY,
            ad_name VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            price INTEGER NOT NULL,
            expiration_date TIMESTAMP NOT NULL,
            is_active BOOLEAN DEFAULT TRUE,
            user_id INTEGER NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        );
    `;
    try {
        await pool.query(query);
    } catch (err) {
        console.error('Ошибка создания таблицы:', err);
    }
};

module.exports = {createAdTable};
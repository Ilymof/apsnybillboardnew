const pool = require('../config/database');

const createBasketTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS baskets (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        );
    `;
    try {
        await pool.query(query);
    } catch (err) {
        console.error('Ошибка создания таблицы baskets:', err);
    }
};

module.exports = {createBasketTable };

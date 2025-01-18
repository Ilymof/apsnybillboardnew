const pool = require('../config/database');

const createBasketAdTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS basket_ads (
            id SERIAL PRIMARY KEY,
            basket_id INTEGER NOT NULL,
            ad_id INTEGER NOT NULL,
            FOREIGN KEY (basket_id) REFERENCES baskets (id) ON DELETE CASCADE,
            FOREIGN KEY (ad_id) REFERENCES ads (id) ON DELETE CASCADE
        );
    `;
    try {
        await pool.query(query);
    } catch (err) {
        console.error('Ошибка создания таблицы basket_ads:', err);
    }
};

module.exports = {createBasketAdTable};

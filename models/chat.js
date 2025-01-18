const pool = require('../config/database');

const createChatTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS chats (
            id SERIAL PRIMARY KEY,
            seller_id INTEGER NOT NULL,
            buyer_id INTEGER NOT NULL,
            ad_id INTEGER NOT NULL,
            FOREIGN KEY (seller_id) REFERENCES users (id) ON DELETE CASCADE,
            FOREIGN KEY (buyer_id) REFERENCES users (id) ON DELETE CASCADE,
            FOREIGN KEY (ad_id) REFERENCES ads (id) ON DELETE CASCADE
        );
    `;
    try {
        await pool.query(query);
    } catch (err) {
        console.error('Ошибка создания таблицы chats:', err);
    }
};

module.exports = {createChatTable};
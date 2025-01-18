const pool = require('../config/database');

const createMessageTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS messages (
            id SERIAL PRIMARY KEY,
            content TEXT NOT NULL,
            is_read BOOLEAN DEFAULT FALSE,
            chat_id INTEGER NOT NULL,
            sender_id INTEGER NOT NULL,
            FOREIGN KEY (chat_id) REFERENCES chats (id) ON DELETE CASCADE,
            FOREIGN KEY (sender_id) REFERENCES users (id) ON DELETE CASCADE
        );
    `;
    try {
        await pool.query(query);
        console.log('Таблица messages создана.');
    } catch (err) {
        console.error('Ошибка создания таблицы messages:', err);
    }
};

module.exports = {createMessageTable};
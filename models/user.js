const pool = require('../config/database');

const createUserTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password TEXT NOT NULL,
            phone_number BIGINT,
            telegram VARCHAR(255),
            whatsapp VARCHAR(255),
            role VARCHAR(50) DEFAULT 'USER',
            confirmation_code VARCHAR(255),
            is_confirmed BOOLEAN DEFAULT false
        );
    `;
    try {
        await pool.query(query);
    } catch (err) {
        console.error('Ошибка создания таблицы:', err);
    }
};

module.exports = {createUserTable};
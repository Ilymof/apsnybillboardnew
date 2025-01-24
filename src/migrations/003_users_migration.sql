DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY, 
    full_name VARCHAR(255) NOT NULL, 
    role_id INT REFERENCES roles(id) ON DELETE SET NULL, 
    phone VARCHAR(20) UNIQUE NOT NULL,
    telegram VARCHAR(255), 
    whatsapp VARCHAR(255), 
    ip VARCHAR(45), 
    useragent TEXT, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO users (full_name, role_id, phone, telegram, whatsapp, ip, useragent)
VALUES
('Иван Иванов', 1, '+79991234567', '@ivanivanov', '+79990001234', '192.168.1.1', 'Mozilla/5.0');

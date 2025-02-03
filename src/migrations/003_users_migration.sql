DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY, 
    full_name VARCHAR(255) NOT NULL, 
    role_id INT REFERENCES roles(id) ON DELETE SET NULL, 
    phone VARCHAR(20) UNIQUE,
    telegram VARCHAR(255), 
    whatsapp VARCHAR(255), 
    ip VARCHAR(45), 
    useragent TEXT, 
    auth_provider VARCHAR(50),
    provider_user_id VARCHAR(255), 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_provider_unique UNIQUE (provider_user_id, auth_provider) -- Добавлено уникальное ограничение
);

INSERT INTO users (full_name, role_id, phone, telegram, whatsapp, ip, useragent, auth_provider, provider_user_id)
VALUES
('Иван Иванов', 1, '+79991234567', '@ivanivanov', '+79990001234', '192.168.1.1', 'Mozilla/5.0', 'telegram', '123456789'); 

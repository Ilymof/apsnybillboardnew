DROP TABLE IF EXISTS listings CASCADE;

CREATE TABLE listings (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    city_id INT REFERENCES city(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

INSERT INTO listings (user_id, city_id, title, description, price) VALUES
(1, 1, 'Квартира в центре', 'Просторная квартира в центре города.', 50000.00),
(1, 1, 'Продажа автомобиля', 'Новый автомобиль, пробег 0.', 1500000.00),
(1, 1, 'Работа для программистов', 'Ищем программистов на удалённую работу.', 0.00);

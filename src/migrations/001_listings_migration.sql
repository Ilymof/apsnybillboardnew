DROP TABLE IF EXISTS listings CASCADE;

CREATE TABLE listings (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    city_id INT REFERENCES city(id) ON DELETE CASCADE,
    category_id INT REFERENCES category(id) ON DELETE SET NULL,
    subcategory_id INT REFERENCES subcategory(id) ON DELETE SET NULL,
    telegram VARCHAR(255),
    whatsapp VARCHAR(255),
    phone VARCHAR(255),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    images TEXT[] DEFAULT ARRAY[]::TEXT[], 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiration_days INTEGER CHECK (expiration_days >= 1 AND expiration_days <= 30)
);

INSERT INTO listings (user_id, city_id, category_id, subcategory_id, title, description, price, images) VALUES
(1, 1, 1, 1, 'Квартира в центре', 'Просторная квартира в центре города.', 50000.00, ARRAY['https://example.com/image1.jpg', 'https://example.com/image2.jpg']),
(1, 1, 2, 3, 'Продажа автомобиля', 'Новый автомобиль, пробег 0.', 1500000.00, ARRAY['https://example.com/car1.jpg', 'https://example.com/car2.jpg']),
(1, 1, 3, 5, 'Работа для программистов', 'Ищем программистов на удалённую работу.', 0.00, ARRAY[]::TEXT[]); -- Пустой массив картинок

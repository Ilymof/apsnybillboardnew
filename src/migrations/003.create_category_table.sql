DROP TABLE IF EXISTS subcategory;
DROP TABLE IF EXISTS category;

CREATE TABLE category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE,
    path VARCHAR(255) UNIQUE,
    image VARCHAR(255)
);

CREATE TABLE subcategory (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    categoryId INT NOT NULL REFERENCES category(id) ON DELETE CASCADE,
    path VARCHAR(255) UNIQUE
);

INSERT INTO category (name, path, image) VALUES
('Электроника', '/electronics', 'electronics.jpg'),
('Одежда', '/clothing', 'clothing.jpg'),
('Автомобили', '/cars', 'cars.jpg'),
('Недвижимость', '/real-estate', 'real-estate.jpg'),
('Работа', '/jobs', 'jobs.jpg'),
('Услуги', '/services', 'services.jpg'),
('Хобби и отдых', '/hobbies', 'hobbies.jpg'),
('Дом и сад', '/home-garden', 'home-garden.jpg'),
('Детские товары', '/kids', 'kids.jpg'),
('Животные', '/pets', 'pets.jpg');

INSERT INTO subcategory (name, categoryId, path) VALUES
('Smartphones', (SELECT id FROM category WHERE name = 'Электроника'), '/smartphones'),
('Refrigerators', (SELECT id FROM category WHERE name = 'Одежда'), '/refrigerators'),
('Mens Clothing', (SELECT id FROM category WHERE name = 'Автомобили'), '/mens-clothing'),
('Fiction', (SELECT id FROM category WHERE name = 'Недвижимость'), '/fiction'),
('Fitness Equipment', (SELECT id FROM category WHERE name = 'Работа'), '/fitness-equipment'),
('Educational Toys', (SELECT id FROM category WHERE name = 'Услуги'), '/educational-toys'),
('Office Chairs', (SELECT id FROM category WHERE name = 'Хобби и отдых'), '/office-chairs'),
('Car Accessories', (SELECT id FROM category WHERE name = 'Дом и сад'), '/car-accessories'),
('Makeup', (SELECT id FROM category WHERE name = 'Детские товары'), '/makeup'),
('Organic Food', (SELECT id FROM category WHERE name = 'Животные'), '/organic-food');
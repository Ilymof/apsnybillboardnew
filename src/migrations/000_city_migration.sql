DROP TABLE IF EXISTS city CASCADE;

CREATE TABLE city (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

INSERT INTO city (name) VALUES 
('Сухум'),
('Гагра'),
('Гудаута'),
('Очамчыра'),
('Гал'),
('Афон'),
('Ткуарчал');
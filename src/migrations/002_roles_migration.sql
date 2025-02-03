DROP TABLE IF EXISTS roles CASCADE;

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    permissions TEXT[] NOT NULL 
);

INSERT INTO roles (name, permissions) VALUES
('user', ARRAY['create', 'read', 'update', 'delete']);

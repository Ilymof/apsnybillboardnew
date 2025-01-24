DROP TABLE IF EXISTS tokens CASCADE;

CREATE TABLE tokens (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE, 
    token VARCHAR(255) NOT NULL, 
    expires_at TIMESTAMP NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

INSERT INTO tokens (user_id, token, expires_at) VALUES
(1, 'token123456789', NOW() + INTERVAL '1 day'),
(1, 'token987654321', NOW() + INTERVAL '1 day'),
(1, 'token111111111', NOW() + INTERVAL '1 day');

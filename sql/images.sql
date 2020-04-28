DROP TABLE IF EXISTS images, comments;

CREATE TABLE images(
    id SERIAL PRIMARY KEY,
    url VARCHAR NOT NULL,
    username VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(1)
);

CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    comment VARCHAR NOT NULL,
    commenter VARCHAR NOT NULL,
    img_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(1)
);
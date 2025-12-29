DROP DATABASE IF EXISTS moviesdb;
CREATE DATABASE moviesdb;
USE moviesdb;

-- Tabla movie
CREATE TABLE movie (
	id BINARY(16) PRIMARY KEY,
	title VARCHAR(255) NOT NULL,
	year INT NOT NULL,
	director VARCHAR(255) NOT NULL,
	duration INT NOT NULL,
	poster TEXT,
	rate DECIMAL(3,1) UNSIGNED NOT NULL
) ENGINE=InnoDB;

-- Tabla genre
CREATE TABLE genre (
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(255) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- Tabla intermedia
CREATE TABLE movie_genres (
	movie_id BINARY(16) NOT NULL,
	genre_id INT NOT NULL,
	PRIMARY KEY (movie_id, genre_id),
	FOREIGN KEY (movie_id) REFERENCES movie(id),
	FOREIGN KEY (genre_id) REFERENCES genre(id)
) ENGINE=InnoDB;

-- Insertar géneros
INSERT INTO genre (name) VALUES
('Drama'),
('Action'),
('Crime'),
('Adventure'),
('Sci-Fi'),
('Romance');

-- Insertar películas (UUID binario compatible con XAMPP)
INSERT INTO movie (id, title, year, director, duration, poster, rate) VALUES
(UNHEX(REPLACE(UUID(), '-', '')), 'Inception', 2010, 'Christopher Nolan', 180,
 'https://m.media-amazon.com/images/I/91Rc8cAmnAL._AC_UF1000,1000_QL80_.jpg', 8.8),
(UNHEX(REPLACE(UUID(), '-', '')), 'The Shawshank Redemption', 1994, 'Frank Darabont', 142,
 'https://i.ebayimg.com/images/g/4goAAOSwMyBe7hnQ/s-l1200.webp', 7.0),
(UNHEX(REPLACE(UUID(), '-', '')), 'The Dark Knight', 2008, 'Christopher Nolan', 148,
 'https://m.media-amazon.com/images/I/91Rc8cAmnAL._AC_UF1000,1000_QL80_.jpg', 9.0);

-- Relación películas ↔ géneros
INSERT INTO movie_genres (movie_id, genre_id) VALUES
((SELECT id FROM movie WHERE title = 'Inception'),
 (SELECT id FROM genre WHERE name = 'Sci-Fi')),
((SELECT id FROM movie WHERE title = 'Inception'),
 (SELECT id FROM genre WHERE name = 'Action')),
((SELECT id FROM movie WHERE title = 'The Shawshank Redemption'),
 (SELECT id FROM genre WHERE name = 'Drama')),
((SELECT id FROM movie WHERE title = 'The Dark Knight'),
 (SELECT id FROM genre WHERE name = 'Action'));

-- Ver películas con UUID legible
SELECT
	LOWER(CONCAT_WS('-',
		SUBSTR(HEX(id), 1, 8),
		SUBSTR(HEX(id), 9, 4),
		SUBSTR(HEX(id), 13, 4),
		SUBSTR(HEX(id), 17, 4),
		SUBSTR(HEX(id), 21)
	)) AS uuid,
	title, year, rate
FROM movie;
DROP TABLE IF EXISTS addMovie;
DROP TABLE IF NOT EXISTS addMovie;
CREATE TABLE addMovie (
    id INTEGER,
    title VARCHAR (255),
    release_date VARCHAR(255),
    poster_path VARCHAR(255),
    overview VARCHAR(500),
    Comment VARCHAR(1000)
)
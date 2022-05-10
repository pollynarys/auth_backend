
CREATE TABLE "users"(
    id serial PRIMARY KEY,
    username VARCHAR ( 255 ) UNIQUE NOT NULL,
    password VARCHAR ( 255 ) NOT NULL,
    email VARCHAR ( 255 ) UNIQUE NOT NULL,
    activation_link VARCHAR ( 255 ) NOT NULL,
    is_activated BOOLEAN NOT NULL
);

CREATE TABLE "tokens"(
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES "users" (id),
    refresh_token VARCHAR ( 255 ) UNIQUE NOT NULL
);

CREATE TABLE "posts"(
    id serial PRIMARY KEY,
    title VARCHAR ( 255 ) NOT NULL,
    content VARCHAR ( 255 ) NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES "users" (id)
);

--DROP TABLE IF EXISTS Public.tokens;
--DROP TABLE IF EXISTS Public.posts;
--DROP TABLE IF EXISTS Public.users;

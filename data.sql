CREATE TABLE users (id SERIAL PRIMARY KEY, 
                    username TEXT UNIQUE,
                    password TEXT NOT NULL,
                    email TEXT NOT NULL UNIQUE,
                    firstname TEXT NOT NULL,
                    lastname TEXT NOT NULL,
                    address TEXT NULL,
                    city TEXT NULL,
                    state TEXT NULL,
                    country TEXT NULL,
                    zipcode INT NULL
                    );

CREATE TABLE upc (upc_code BIGINT PRIMARY KEY,
                title TEXT, 
                brand TEXT NOT NULL,
                model TEXT NOT NULL,
                category TEXT NOT NULL,
                image_link TEXT NOT NULL, 
                description TEXT NOT NULL
);

CREATE TABLE user_product(
                    id SERIAL PRIMARY KEY, 
                    product_name TEXT,
                    purchased_at TEXT,
                    product_price NUMERIC,
                    purchase_date DATE,
                    warranty_period TEXT,
                    return_policy TEXT,
                    manual_link TEXT, 
                    serial_number UNIQUE TEXT,
                    receipt_image TEXT,
                    user_product_image TEXT,
                    upc BIGINT,
                    userid INT CONSTRAINT fk_users REFERENCES users ON DELETE CASCADE
                    );


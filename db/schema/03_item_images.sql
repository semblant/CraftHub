-- Drop and recreate ItemImages table

DROP TABLE IF EXISTS item_images CASCADE;
CREATE TABLE item_images (
  id SERIAL PRIMARY KEY NOT NULL,
  item_id INT,
  image_url TEXT NOT NULL,
  FOREIGN KEY (item_id) REFERENCES items(id)
);

-- Users table seeds

INSERT INTO users (name, email, password, phone, profile_pic_url, is_admin) VALUES
('Seller', 'admin@example.com', 'hashedpassword1', '123-456-7890', 'http://example.com/admin.jpg', TRUE),
('Buyer', 'user@example.com', 'hashedpassword2', '098-765-4321', 'http://example.com/user.jpg', FALSE);

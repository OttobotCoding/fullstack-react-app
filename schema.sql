-- Run this to set up your MySQL database manually (optional — server.js auto-creates the table)

CREATE DATABASE IF NOT EXISTS contacts_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE contacts_db;

CREATE TABLE IF NOT EXISTS contacts (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255)  NOT NULL,
  email       VARCHAR(255)  NOT NULL,
  phone       VARCHAR(50),
  subject     VARCHAR(255)  NOT NULL,
  message     TEXT          NOT NULL,
  created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- Sample data (optional)
INSERT INTO contacts (name, email, phone, subject, message) VALUES
  ('Alice Johnson', 'alice@example.com', '+1-555-0100', 'General Inquiry', 'Hello! Just testing the form.'),
  ('Bob Martinez', 'bob@example.com', NULL, 'Support', 'I need help with the application.');

ALTER TABLE admins
ADD COLUMN role ENUM('admin', 'editor') NOT NULL DEFAULT 'admin' AFTER password_hash;

UPDATE admins
SET role = 'admin'
WHERE role IS NULL OR role = '';

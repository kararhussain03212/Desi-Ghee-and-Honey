ALTER TABLE admins
ADD COLUMN designation VARCHAR(120) NULL AFTER status,
ADD COLUMN phone VARCHAR(50) NULL AFTER designation,
ADD COLUMN location VARCHAR(190) NULL AFTER phone,
ADD COLUMN permissions_json JSON NULL AFTER location;

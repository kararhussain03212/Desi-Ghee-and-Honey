<?php

declare(strict_types=1);

use Backend\Config\Database;
use Backend\Utils\Cache;

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/Cache.php';

$pdo = Database::connection();
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$settings = [
    'footer_contact_title' => 'CONTACT',
    'footer_contact_address' => 'I-8 Markaz I 8 Markaz I-8, Islamabad, Pakistan',
    'footer_contact_phone' => '+92 333 8399480',
    'footer_contact_email' => 'info@swiftsigngeneraltrading.com',
];

try {
    $pdo->beginTransaction();

    $stmt = $pdo->prepare(
        'INSERT INTO settings (setting_key, setting_value, setting_type, order_position, status, created_at, updated_at)
         VALUES (:setting_key, :setting_value, :setting_type, :order_position, :status, NOW(), NOW())
         ON DUPLICATE KEY UPDATE
            setting_value = VALUES(setting_value),
            setting_type = VALUES(setting_type),
            status = VALUES(status),
            updated_at = NOW()'
    );

    $position = 1;
    foreach ($settings as $key => $value) {
        $stmt->execute([
            ':setting_key' => (string) $key,
            ':setting_value' => (string) $value,
            ':setting_type' => 'text',
            ':order_position' => $position++,
            ':status' => 'active',
        ]);
    }

    $pdo->commit();
    Cache::clearAll();
    echo "Footer contact dynamic settings seeded successfully.\n";
} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo 'Seeding failed: ' . $e->getMessage() . PHP_EOL;
    exit(1);
}


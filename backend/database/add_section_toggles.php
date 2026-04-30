<?php

declare(strict_types=1);

use Backend\Config\Database;
use Backend\Config\Env;

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/env.php';

Env::load(dirname(__DIR__) . '/.env');

$pdo = Database::connection();
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$settings = [
    ['home_testimonials', 'active', 'toggle'],
    ['home_newsletter', 'active', 'toggle'],
];

try {
    $pdo->beginTransaction();

    $stmt = $pdo->prepare('
        INSERT IGNORE INTO settings (setting_key, setting_value, setting_type, status, created_at, updated_at)
        VALUES (:key, :value, :type, :status, NOW(), NOW())
    ');

    foreach ($settings as $setting) {
        $stmt->execute([
            ':key' => $setting[0],
            ':value' => $setting[1],
            ':type' => $setting[2],
            ':status' => 'active',
        ]);
    }

    $pdo->commit();
    echo "✓ Section toggles added: home_testimonials, home_newsletter\n";
} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo "✗ Error: " . $e->getMessage() . PHP_EOL;
    exit(1);
}

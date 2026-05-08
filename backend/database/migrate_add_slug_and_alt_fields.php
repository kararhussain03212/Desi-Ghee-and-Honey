<?php

declare(strict_types=1);

use Backend\Config\Database;

require_once __DIR__ . '/../config/database.php';

$pdo = Database::connection();

function hasColumn(PDO $pdo, string $table, string $column): bool
{
    $stmt = $pdo->prepare(
        'SELECT COUNT(*) FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = :table AND COLUMN_NAME = :column'
    );
    $stmt->execute([
        ':table' => $table,
        ':column' => $column,
    ]);
    return (int) $stmt->fetchColumn() > 0;
}

function slugifyValue(string $value): string
{
    $value = trim($value);
    $value = strtolower($value);
    $value = preg_replace('/[^a-z0-9]+/i', '-', $value) ?? '';
    $value = trim($value, '-');
    return $value !== '' ? $value : 'item';
}

function ensureUniqueSlug(PDO $pdo, string $table, string $slug, int $id): string
{
    $candidate = $slug;
    $suffix = 2;

    while (true) {
        $stmt = $pdo->prepare("SELECT id FROM `{$table}` WHERE slug = :slug AND id != :id LIMIT 1");
        $stmt->execute([
            ':slug' => $candidate,
            ':id' => $id,
        ]);

        if (!$stmt->fetch()) {
            return $candidate;
        }

        $candidate = $slug . '-' . $suffix;
        $suffix++;
    }
}

try {
    if (!hasColumn($pdo, 'products', 'image_alt')) {
        $pdo->exec("ALTER TABLE `products` ADD COLUMN `image_alt` VARCHAR(255) NULL AFTER `image_path`");
    }

    if (!hasColumn($pdo, 'hero_slides', 'slug')) {
        $pdo->exec("ALTER TABLE `hero_slides` ADD COLUMN `slug` VARCHAR(190) NULL AFTER `title`");
    }
    if (!hasColumn($pdo, 'hero_slides', 'image_alt')) {
        $pdo->exec("ALTER TABLE `hero_slides` ADD COLUMN `image_alt` VARCHAR(255) NULL AFTER `image_path`");
    }

    if (!hasColumn($pdo, 'testimonials', 'slug')) {
        $pdo->exec("ALTER TABLE `testimonials` ADD COLUMN `slug` VARCHAR(190) NULL AFTER `name`");
    }
    if (!hasColumn($pdo, 'testimonials', 'avatar_alt')) {
        $pdo->exec("ALTER TABLE `testimonials` ADD COLUMN `avatar_alt` VARCHAR(255) NULL AFTER `avatar_path`");
    }

    $heroRows = $pdo->query("SELECT id, title, slug FROM `hero_slides`")->fetchAll(PDO::FETCH_ASSOC) ?: [];
    $heroUpdate = $pdo->prepare("UPDATE `hero_slides` SET slug = :slug WHERE id = :id");
    foreach ($heroRows as $row) {
        $current = trim((string) ($row['slug'] ?? ''));
        if ($current !== '') {
            continue;
        }

        $slug = ensureUniqueSlug($pdo, 'hero_slides', slugifyValue((string) ($row['title'] ?? '')), (int) $row['id']);
        $heroUpdate->execute([
            ':slug' => $slug,
            ':id' => (int) $row['id'],
        ]);
    }

    $testimonialRows = $pdo->query("SELECT id, name, slug FROM `testimonials`")->fetchAll(PDO::FETCH_ASSOC) ?: [];
    $testimonialUpdate = $pdo->prepare("UPDATE `testimonials` SET slug = :slug WHERE id = :id");
    foreach ($testimonialRows as $row) {
        $current = trim((string) ($row['slug'] ?? ''));
        if ($current !== '') {
            continue;
        }

        $slug = ensureUniqueSlug($pdo, 'testimonials', slugifyValue((string) ($row['name'] ?? '')), (int) $row['id']);
        $testimonialUpdate->execute([
            ':slug' => $slug,
            ':id' => (int) $row['id'],
        ]);
    }

    echo "Slug and alt fields migration completed successfully.\n";
} catch (Throwable $e) {
    fwrite(STDERR, "Migration failed: " . $e->getMessage() . "\n");
    exit(1);
}

<?php

declare(strict_types=1);

use Backend\Config\Database;

require_once __DIR__ . '/../config/database.php';

const WEBP_QUALITY = 82;
const CONVERTIBLE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'jfif', 'webp'];

if (PHP_SAPI !== 'cli') {
    echo "Run this script from CLI only.\n";
    exit(1);
}
@ini_set('memory_limit', '512M');

if (!function_exists('imagewebp')) {
    echo "GD with WebP support is required (missing imagewebp).\n";
    exit(1);
}

$uploadsDir = realpath(dirname(__DIR__) . '/uploads');
if ($uploadsDir === false || !is_dir($uploadsDir)) {
    echo "Uploads directory not found.\n";
    exit(1);
}

$mapping = [];
$converted = 0;
$skipped = 0;
$failed = 0;

$iterator = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($uploadsDir, FilesystemIterator::SKIP_DOTS)
);

foreach ($iterator as $fileInfo) {
    if (!$fileInfo->isFile()) {
        continue;
    }

    $sourcePath = $fileInfo->getPathname();
    $ext = strtolower((string) pathinfo($sourcePath, PATHINFO_EXTENSION));
    if (!in_array($ext, CONVERTIBLE_EXTENSIONS, true)) {
        continue;
    }

    $relative = str_replace('\\', '/', substr($sourcePath, strlen($uploadsDir)));
    $oldPublicPath = '/uploads' . $relative;
    $newPublicPath = preg_replace('/\.[^.]+$/', '.webp', $oldPublicPath);
    $targetPath = preg_replace('/\.[^.]+$/', '.webp', $sourcePath);

    if (!is_string($newPublicPath) || !is_string($targetPath)) {
        $failed++;
        continue;
    }

    if (str_ends_with(strtolower($sourcePath), '.webp')) {
        $mapping[$oldPublicPath] = $oldPublicPath;
        $skipped++;
        continue;
    }

    $ok = convertToWebp($sourcePath, $targetPath, $ext);
    if (!$ok) {
        $fallbackDir = dirname($sourcePath) . DIRECTORY_SEPARATOR . 'webp';
        if (!is_dir($fallbackDir)) {
            @mkdir($fallbackDir, 0775, true);
        }
        $fallbackTarget = $fallbackDir . DIRECTORY_SEPARATOR . pathinfo($sourcePath, PATHINFO_FILENAME) . '.webp';
        if (is_dir($fallbackDir)) {
            $ok = convertToWebp($sourcePath, $fallbackTarget, $ext);
            if ($ok) {
                $targetPath = $fallbackTarget;
                $relativeTarget = str_replace('\\', '/', substr($targetPath, strlen($uploadsDir)));
                $newPublicPath = '/uploads' . $relativeTarget;
            }
        }
    }

    if (!$ok) {
        $failed++;
        echo "[fail] {$sourcePath}\n";
        continue;
    }

    $mapping[$oldPublicPath] = $newPublicPath;
    $converted++;

    if (is_file($sourcePath) && strtolower($sourcePath) !== strtolower($targetPath)) {
        @unlink($sourcePath);
    }
}

if ($converted === 0 && count($mapping) === 0) {
    echo "No images found to convert.\n";
    exit(0);
}

$pdo = Database::connection();
$pdo->beginTransaction();

try {
    $directColumns = [
        ['hero_slides', 'image_path'],
        ['products', 'image_path'],
        ['gallery_items', 'image_path'],
        ['testimonials', 'avatar_path'],
        ['team_members', 'image_path'],
        ['services', 'image_path'],
        ['blog_posts', 'featured_image'],
        ['blog_posts', 'og_image'],
    ];

    foreach ($mapping as $old => $new) {
        if ($old === $new) {
            continue;
        }

        foreach ($directColumns as [$table, $column]) {
            $stmt = $pdo->prepare("UPDATE `$table` SET `$column` = :new WHERE `$column` = :old");
            $stmt->execute([':new' => $new, ':old' => $old]);
        }

        $stmt = $pdo->prepare('UPDATE `settings` SET `setting_value` = REPLACE(`setting_value`, :old, :new) WHERE `setting_value` LIKE :needle');
        $stmt->execute([
            ':old' => $old,
            ':new' => $new,
            ':needle' => '%' . $old . '%',
        ]);
    }

    $pdo->commit();
} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo 'Database update failed: ' . $e->getMessage() . "\n";
    exit(1);
}

$cacheDir = dirname(__DIR__) . '/storage/cache';
if (is_dir($cacheDir)) {
    $cacheFiles = glob($cacheDir . '/*.json') ?: [];
    foreach ($cacheFiles as $cacheFile) {
        @unlink($cacheFile);
    }
}

echo "WebP conversion completed.\n";
echo "Converted: {$converted}\n";
echo "Already webp/skipped: {$skipped}\n";
echo "Failed: {$failed}\n";
echo "Updated DB references and cleared cache.\n";

function createImageResource(string $sourcePath, string $ext)
{
    if ($ext === 'jfif') {
        $ext = 'jpg';
    }

    if ($ext === 'jpg' || $ext === 'jpeg') {
        return @imagecreatefromjpeg($sourcePath);
    }
    if ($ext === 'png') {
        return @imagecreatefrompng($sourcePath);
    }
    if ($ext === 'gif') {
        return @imagecreatefromgif($sourcePath);
    }
    if ($ext === 'webp' && function_exists('imagecreatefromwebp')) {
        return @imagecreatefromwebp($sourcePath);
    }

    return false;
}

function convertToWebp(string $sourcePath, string $targetPath, string $ext): bool
{
    $img = createImageResource($sourcePath, $ext);
    if ($img !== false) {
        if (function_exists('imagepalettetotruecolor')) {
            @imagepalettetotruecolor($img);
        }
        imagealphablending($img, true);
        imagesavealpha($img, true);

        $ok = @imagewebp($img, $targetPath, WEBP_QUALITY);
        imagedestroy($img);
        if ($ok) {
            return true;
        }
    }

    if (class_exists('Imagick')) {
        try {
            $im = new \Imagick($sourcePath);
            $im->setImageFormat('webp');
            $im->setImageCompressionQuality(WEBP_QUALITY);
            $ok = $im->writeImage($targetPath);
            $im->clear();
            $im->destroy();
            return (bool) $ok;
        } catch (\Throwable $e) {
            return false;
        }
    }

    return false;
}

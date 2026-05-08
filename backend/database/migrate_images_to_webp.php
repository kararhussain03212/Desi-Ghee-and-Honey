<?php

declare(strict_types=1);

use Backend\Config\Database;

require_once __DIR__ . '/../config/database.php';

const DEFAULT_TABLE = 'images';
const DEFAULT_ID_COLUMN = 'id';
const DEFAULT_PATH_COLUMN = 'image_path';
const DEFAULT_QUALITY = 82;

if (PHP_SAPI !== 'cli') {
    echo "Run this script from CLI.\n";
    exit(1);
}

@ini_set('memory_limit', '512M');

if (!function_exists('imagewebp')) {
    echo "GD WebP support is required (missing imagewebp()).\n";
    exit(1);
}

$opts = getopt('', [
    'table::',
    'id-column::',
    'path-column::',
    'quality::',
    'use-webp-folder::',
    'base-dir::',
    'uploads-dir::',
    'preset::',
]);

$table = (string) ($opts['table'] ?? DEFAULT_TABLE);
$idColumn = (string) ($opts['id-column'] ?? DEFAULT_ID_COLUMN);
$pathColumn = (string) ($opts['path-column'] ?? DEFAULT_PATH_COLUMN);
$quality = (int) ($opts['quality'] ?? DEFAULT_QUALITY);
$quality = max(75, min(85, $quality));
$useWebpFolder = filter_var((string) ($opts['use-webp-folder'] ?? '0'), FILTER_VALIDATE_BOOLEAN);

$baseDir = (string) ($opts['base-dir'] ?? realpath(dirname(__DIR__)));
$baseDir = rtrim(str_replace('\\', '/', $baseDir), '/');
if ($baseDir === '' || !is_dir($baseDir)) {
    echo "Invalid base dir: {$baseDir}\n";
    exit(1);
}
$uploadsDir = (string) ($opts['uploads-dir'] ?? ($baseDir . '/uploads'));
$uploadsDir = rtrim(str_replace('\\', '/', $uploadsDir), '/');
if ($uploadsDir === '' || !is_dir($uploadsDir)) {
    echo "Invalid uploads dir: {$uploadsDir}\n";
    exit(1);
}

if (!preg_match('/^[a-zA-Z0-9_]+$/', $table) || !preg_match('/^[a-zA-Z0-9_]+$/', $idColumn) || !preg_match('/^[a-zA-Z0-9_]+$/', $pathColumn)) {
    echo "Invalid table/column names.\n";
    exit(1);
}

$pdo = Database::connection();
$preset = strtolower((string) ($opts['preset'] ?? ''));
$targets = [];

if ($preset === 'project') {
    $targets = [
        ['table' => 'hero_slides', 'id' => 'id', 'path' => 'image_path'],
        ['table' => 'products', 'id' => 'id', 'path' => 'image_path'],
        ['table' => 'gallery_items', 'id' => 'id', 'path' => 'image_path'],
        ['table' => 'testimonials', 'id' => 'id', 'path' => 'avatar_path'],
        ['table' => 'team_members', 'id' => 'id', 'path' => 'image_path'],
        ['table' => 'services', 'id' => 'id', 'path' => 'image_path'],
        ['table' => 'blog_posts', 'id' => 'id', 'path' => 'featured_image'],
        ['table' => 'blog_posts', 'id' => 'id', 'path' => 'og_image'],
    ];
} else {
    $targets = [['table' => $table, 'id' => $idColumn, 'path' => $pathColumn]];
}

$totalConverted = 0;
$totalSkipped = 0;
$totalFailed = 0;
$tablesProcessed = 0;

foreach ($targets as $target) {
    $tableName = $target['table'];
    $idCol = $target['id'];
    $pathCol = $target['path'];

    if (!tableExists($pdo, $tableName)) {
        if ($preset === 'project') {
            echo "[skip] table not found: {$tableName}\n";
            continue;
        }
        echo "Table '{$tableName}' does not exist.\n";
        echo "Tip: use --preset=project for this codebase.\n";
        exit(1);
    }

    if (!columnExists($pdo, $tableName, $pathCol)) {
        if ($preset === 'project') {
            echo "[skip] column not found: {$tableName}.{$pathCol}\n";
            continue;
        }
        echo "Column '{$pathCol}' not found in table '{$tableName}'.\n";
        exit(1);
    }

    $sql = sprintf(
        'SELECT `%s` AS id, `%s` AS image_path FROM `%s` WHERE `%s` IS NOT NULL AND `%s` <> \'\'',
        $idCol,
        $pathCol,
        $tableName,
        $pathCol,
        $pathCol
    );

    $rows = $pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC) ?: [];
    if (count($rows) === 0) {
        echo "[info] no rows in {$tableName}.{$pathCol}\n";
        $tablesProcessed++;
        continue;
    }

    $converted = 0;
    $skipped = 0;
    $failed = 0;

    foreach ($rows as $row) {
        $id = (string) ($row['id'] ?? '');
        $dbPath = (string) ($row['image_path'] ?? '');

        $normalizedPath = str_replace('\\', '/', $dbPath);
        if (str_starts_with($normalizedPath, 'http://') || str_starts_with($normalizedPath, 'https://')) {
            $skipped++;
            echo "[skip] {$tableName}.{$pathCol} #{$id} remote URL: {$dbPath}\n";
            continue;
        }

        $sourcePath = resolveSourcePath($normalizedPath, $baseDir, $uploadsDir);
        if (!is_file($sourcePath)) {
            $found = findByBasenameInUploads($uploadsDir, basename($normalizedPath));
            if ($found !== '') {
                $sourcePath = $found;
                echo "[info] {$tableName}.{$pathCol} #{$id} resolved by basename: {$sourcePath}\n";
            } else {
                if (str_ends_with(strtolower($normalizedPath), '.webp')) {
                    $skipped++;
                    echo "[skip] {$tableName}.{$pathCol} #{$id} missing webp source: {$normalizedPath}\n";
                    continue;
                }
                $failed++;
                echo "[fail] {$tableName}.{$pathCol} #{$id} file not found: {$sourcePath}\n";
                continue;
            }
        }

        $ext = strtolower((string) pathinfo($sourcePath, PATHINFO_EXTENSION));
        if ($ext === 'webp') {
            $skipped++;
            echo "[skip] {$tableName}.{$pathCol} #{$id} already webp: {$dbPath}\n";
            continue;
        }
        if (!in_array($ext, ['jpg', 'jpeg', 'png'], true)) {
            $skipped++;
            echo "[skip] {$tableName}.{$pathCol} #{$id} unsupported ext .{$ext}: {$dbPath}\n";
            continue;
        }

        $targetDir = dirname($sourcePath);
        if ($useWebpFolder) {
            $targetDir .= '/webp';
            if (!is_dir($targetDir) && !mkdir($targetDir, 0775, true) && !is_dir($targetDir)) {
                $failed++;
                echo "[fail] {$tableName}.{$pathCol} #{$id} cannot create dir: {$targetDir}\n";
                continue;
            }
        }

        $baseName = (string) pathinfo($sourcePath, PATHINFO_FILENAME);
        $targetPath = $targetDir . '/' . $baseName . '.webp';

        $image = createImageResource($sourcePath, $ext);
        if (!$image) {
            $failed++;
            echo "[fail] {$tableName}.{$pathCol} #{$id} GD decode failed: {$sourcePath}\n";
            continue;
        }

        if (function_exists('imagepalettetotruecolor')) {
            @imagepalettetotruecolor($image);
        }
        imagealphablending($image, true);
        imagesavealpha($image, true);

        $ok = @imagewebp($image, $targetPath, $quality);
        imagedestroy($image);

        if (!$ok) {
            $failed++;
            echo "[fail] {$tableName}.{$pathCol} #{$id} WebP save failed: {$targetPath}\n";
            continue;
        }

        $newDbPath = buildPublicUploadPath($targetPath, $uploadsDir);
        if ($newDbPath === '') {
            $failed++;
            echo "[fail] {$tableName}.{$pathCol} #{$id} target outside uploads dir: {$targetPath}\n";
            continue;
        }

        try {
            $stmt = $pdo->prepare(sprintf('UPDATE `%s` SET `%s` = :new_path WHERE `%s` = :id', $tableName, $pathCol, $idCol));
            $stmt->execute([
                ':new_path' => $newDbPath,
                ':id' => $id,
            ]);
            $converted++;
            echo "[ok] {$tableName}.{$pathCol} #{$id} {$dbPath} -> {$newDbPath}\n";
        } catch (Throwable $e) {
            $failed++;
            echo "[fail] {$tableName}.{$pathCol} #{$id} DB update failed: {$e->getMessage()}\n";
        }
    }

    $tablesProcessed++;
    $totalConverted += $converted;
    $totalSkipped += $skipped;
    $totalFailed += $failed;
    echo "[done] {$tableName}.{$pathCol} converted={$converted}, skipped={$skipped}, failed={$failed}\n";
}

echo "\nDone\n";
echo "Tables processed: {$tablesProcessed}\n";
echo "Converted: {$totalConverted}\n";
echo "Skipped: {$totalSkipped}\n";
echo "Failed: {$totalFailed}\n";
echo "Quality: {$quality}\n";
echo "Use /webp folder: " . ($useWebpFolder ? 'yes' : 'no') . "\n";
echo "Uploads dir: {$uploadsDir}\n";

function tableExists(PDO $pdo, string $table): bool
{
    $stmt = $pdo->prepare('SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = :table');
    $stmt->execute([':table' => $table]);
    return ((int) $stmt->fetchColumn()) > 0;
}

function columnExists(PDO $pdo, string $table, string $column): bool
{
    $stmt = $pdo->prepare('SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = :table AND column_name = :column');
    $stmt->execute([
        ':table' => $table,
        ':column' => $column,
    ]);
    return ((int) $stmt->fetchColumn()) > 0;
}

function createImageResource(string $path, string $ext)
{
    if (!hasEnoughMemoryForImage($path)) {
        return false;
    }

    if ($ext === 'jpg' || $ext === 'jpeg') {
        return @imagecreatefromjpeg($path);
    }
    if ($ext === 'png') {
        return @imagecreatefrompng($path);
    }
    return false;
}

function resolveSourcePath(string $dbPath, string $baseDir, string $uploadsDir): string
{
    $normalized = str_replace('\\', '/', trim($dbPath));

    // Absolute filesystem path
    if (preg_match('/^[A-Za-z]:\//', $normalized) === 1) {
        return $normalized;
    }

    // Public path style: /uploads/...
    if (str_starts_with($normalized, '/uploads/')) {
        $rel = ltrim(substr($normalized, strlen('/uploads/')), '/');
        return $uploadsDir . '/' . $rel;
    }

    // Relative path already under uploads
    if (str_starts_with($normalized, 'uploads/')) {
        $rel = ltrim(substr($normalized, strlen('uploads/')), '/');
        return $uploadsDir . '/' . $rel;
    }

    // Fallback: old behavior
    return $baseDir . '/' . ltrim($normalized, '/');
}

function buildPublicUploadPath(string $targetPath, string $uploadsDir): string
{
    $normalizedTarget = str_replace('\\', '/', $targetPath);
    $normalizedUploads = rtrim(str_replace('\\', '/', $uploadsDir), '/');
    if (!str_starts_with($normalizedTarget, $normalizedUploads . '/')) {
        return '';
    }
    $rel = ltrim(substr($normalizedTarget, strlen($normalizedUploads)), '/');
    return '/uploads/' . $rel;
}

function hasEnoughMemoryForImage(string $path): bool
{
    $info = @getimagesize($path);
    if (!is_array($info) || count($info) < 2) {
        return true;
    }

    $width = (int) ($info[0] ?? 0);
    $height = (int) ($info[1] ?? 0);
    if ($width <= 0 || $height <= 0) {
        return true;
    }

    $needed = (int) ($width * $height * 4 * 1.8); // RGBA + overhead
    $limit = bytesFromIni((string) ini_get('memory_limit'));
    if ($limit <= 0) {
        return true; // unlimited or unknown
    }

    $used = memory_get_usage(true);
    return ($used + $needed) < ($limit - (16 * 1024 * 1024));
}

function bytesFromIni(string $value): int
{
    $v = trim($value);
    if ($v === '' || $v === '-1') {
        return -1;
    }
    $unit = strtolower(substr($v, -1));
    $num = (int) $v;
    if ($unit === 'g') return $num * 1024 * 1024 * 1024;
    if ($unit === 'm') return $num * 1024 * 1024;
    if ($unit === 'k') return $num * 1024;
    return (int) $v;
}

function findByBasenameInUploads(string $uploadsDir, string $basename): string
{
    static $index = null;
    if ($basename === '') {
        return '';
    }

    if (!is_array($index)) {
        $index = [];
        $it = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($uploadsDir, FilesystemIterator::SKIP_DOTS)
        );
        foreach ($it as $fileInfo) {
            if (!$fileInfo->isFile()) {
                continue;
            }
            $name = $fileInfo->getFilename();
            if (!isset($index[$name])) {
                $index[$name] = $fileInfo->getPathname();
            }
        }
    }

    return (string) ($index[$basename] ?? '');
}

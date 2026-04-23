<?php

declare(strict_types=1);

use Backend\Config\Database;

require_once __DIR__ . '/../config/database.php';

$pdo = Database::connection();
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$siteUrl = 'https://swiftsigngeneraltrading.com/';
$html = fetchHtml($siteUrl);

$dom = new DOMDocument();
@$dom->loadHTML($html);
$xpath = new DOMXPath($dom);

$pdo->beginTransaction();

try {
    truncateTables($pdo);

    $heroSlides = extractHeroSlides($xpath, $siteUrl);
    foreach ($heroSlides as $slide) {
        insertHeroSlide($pdo, $slide);
    }

    $products = extractProducts($xpath, $siteUrl);
    foreach ($products as $product) {
        insertProduct($pdo, $product);
    }

    $services = extractServices($xpath, $siteUrl);
    foreach ($services as $service) {
        insertService($pdo, $service);
    }

    $testimonials = extractTestimonials($xpath, $siteUrl);
    foreach ($testimonials as $item) {
        insertTestimonial($pdo, $item);
    }

    $aboutAndContact = extractAboutAndContact($xpath, $siteUrl);
    insertSettings($pdo, $aboutAndContact['settings']);

    insertStats($pdo, [
        ['label' => 'Happy Clients', 'value' => '500', 'suffix' => '+', 'icon' => 'users'],
        ['label' => 'Products', 'value' => (string) max(4, count($products)), 'suffix' => '+', 'icon' => 'package'],
        ['label' => 'Years Experience', 'value' => '10', 'suffix' => '+', 'icon' => 'award'],
    ]);

    createDefaultAdmin($pdo);
    $pdo->commit();

    echo "Seeding completed successfully!\n";
    echo "Default login: admin / admin123 OR admin@swiftsign.com / Admin@123\n";
} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo 'Seeding failed: ' . $e->getMessage() . PHP_EOL;
    exit(1);
}

function fetchHtml(string $url): string
{
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_USERAGENT => 'HoneyGheeSeeder/1.0',
    ]);

    $html = curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    if ($html === false || $status >= 400) {
        throw new RuntimeException('Failed to fetch website HTML: ' . $error);
    }

    return (string) $html;
}

function truncateTables(PDO $pdo): void
{
    $tables = [
        'activity_logs',
        'hero_slides',
        'services',
        'products',
        'team_members',
        'testimonials',
        'blog_posts',
        'gallery_items',
        'stats',
        'settings',
        'admins',
    ];

    $pdo->exec('SET FOREIGN_KEY_CHECKS=0');
    foreach ($tables as $table) {
        $pdo->exec('TRUNCATE TABLE ' . $table);
    }
    $pdo->exec('SET FOREIGN_KEY_CHECKS=1');
}

function extractHeroSlides(DOMXPath $xpath, string $baseUrl): array
{
    $slides = [];
    $nodes = $xpath->query("//*[contains(@class,'hero__slide')]");
    $titles = [];

    $titleNode = $xpath->query("//*[contains(@class,'hero__title')]")->item(0);
    if ($titleNode instanceof DOMElement) {
        foreach ($titleNode->getElementsByTagName('span') as $span) {
            $titles[] = trim($span->textContent);
        }
    }

    $fullTitle = trim(implode(' ', array_filter($titles)));

    foreach ($nodes as $i => $node) {
        $style = (string) $node->getAttribute('style');
        if (!preg_match('/url\([\"\']?(.*?)[\"\']?\)/', $style, $m)) {
            continue;
        }

        $img = resolveUrl($m[1], $baseUrl);
        $local = downloadImage($img, 'hero');

        $slides[] = [
            'title' => $fullTitle !== '' ? $fullTitle : 'Fresh Organic Honey',
            'subtitle' => 'SwiftSign General Trading',
            'button_text' => 'Shop Now',
            'button_link' => '/product',
            'image_path' => $local,
            'order_position' => $i + 1,
            'status' => 'active',
        ];
    }

    if ($slides === []) {
        $slides[] = [
            'title' => 'Fresh Organic Honey',
            'subtitle' => 'SwiftSign General Trading',
            'button_text' => 'Shop Now',
            'button_link' => '/product',
            'image_path' => '/uploads/hero/default.jpg',
            'order_position' => 1,
            'status' => 'active',
        ];
    }

    return $slides;
}

function extractProducts(DOMXPath $xpath, string $baseUrl): array
{
    $items = [];
    $nodes = $xpath->query("//*[contains(@class,'productCard')]");

    foreach ($nodes as $i => $node) {
        $titleNode = $xpath->query(".//*[contains(@class,'productTitleLink') or contains(@class,'productShowcaseCard__overlayText') ]", $node)->item(0);
        $title = $titleNode ? trim($titleNode->textContent) : 'Product ' . ($i + 1);

        $imgNode = $xpath->query('.//img', $node)->item(0);
        $img = $imgNode ? (string) $imgNode->getAttribute('src') : '';
        $img = resolveUrl($img, $baseUrl);
        $local = downloadImage($img, 'products');

        $badgeNode = $xpath->query(".//*[contains(@class,'productBadge')]", $node)->item(0);
        $badge = $badgeNode ? trim($badgeNode->textContent) : 'New';

        $priceNode = $xpath->query(".//*[contains(@class,'productPriceNow') or contains(@class,'productPriceSub')]", $node);
        $variants = [];
        foreach ($priceNode as $pn) {
            $text = trim($pn->textContent);
            if (preg_match('/(\d+\s?(?:kg|g))\s*:\s*Rs\s*([\d,]+)/i', $text, $m)) {
                $variants[] = ['label' => trim($m[1]), 'price' => (float) str_replace(',', '', $m[2])];
            }
        }

        $firstPrice = $variants[0]['price'] ?? 0;

        $items[] = [
            'title' => $title,
            'slug' => slugify($title),
            'sku' => 'HG-' . str_pad((string) ($i + 1), 4, '0', STR_PAD_LEFT),
            'description' => $title . ' sourced from SwiftSign General Trading.',
            'price' => $firstPrice,
            'old_price' => null,
            'badge' => $badge,
            'rating' => 5,
            'image_path' => $local,
            'variants_json' => json_encode($variants, JSON_UNESCAPED_SLASHES),
            'order_position' => $i + 1,
            'status' => 'active',
            'meta_title' => $title,
            'meta_description' => $title . ' - premium quality natural product.',
            'meta_keywords' => 'honey, desi ghee, natural',
        ];
    }

    return $items;
}

function extractServices(DOMXPath $xpath, string $baseUrl): array
{
    $items = [];
    $nodes = $xpath->query("//*[contains(@class,'categoryItem')]");

    foreach ($nodes as $i => $node) {
        $titleNode = $xpath->query('.//*[contains(@class,\'categoryItemTitle\')]', $node)->item(0);
        $descNode = $xpath->query('.//*[contains(@class,\'categoryItemDesc\')]', $node)->item(0);
        $imgNode = $xpath->query('.//img', $node)->item(0);

        $title = $titleNode ? trim($titleNode->textContent) : 'Service ' . ($i + 1);
        $desc = $descNode ? trim($descNode->textContent) : '';
        $icon = $imgNode ? resolveUrl((string) $imgNode->getAttribute('src'), $baseUrl) : '';

        $items[] = [
            'title' => $title,
            'description' => $desc,
            'icon' => downloadImage($icon, 'services'),
            'image_path' => null,
            'order_position' => $i + 1,
            'status' => 'active',
        ];
    }

    return $items;
}

function extractTestimonials(DOMXPath $xpath, string $baseUrl): array
{
    $items = [];
    $nodes = $xpath->query("//*[contains(@class,'clientCard')]");

    foreach ($nodes as $i => $node) {
        $nameNode = $xpath->query('.//*[contains(@class,\'clientName\')]', $node)->item(0);
        $roleNode = $xpath->query('.//*[contains(@class,\'clientRole\')]', $node)->item(0);
        $reviewNode = $xpath->query('.//*[contains(@class,\'clientReview\')]', $node)->item(0);
        $imgNode = $xpath->query('.//img', $node)->item(0);

        $name = $nameNode ? trim($nameNode->textContent) : 'Client ' . ($i + 1);
        $role = $roleNode ? trim($roleNode->textContent) : 'Customer';
        $review = $reviewNode ? trim($reviewNode->textContent, '" ') : '';
        $avatar = $imgNode ? resolveUrl((string) $imgNode->getAttribute('src'), $baseUrl) : '';

        $items[] = [
            'name' => $name,
            'role' => $role,
            'review' => $review,
            'rating' => 5,
            'avatar_path' => downloadImage($avatar, 'testimonials'),
            'order_position' => $i + 1,
            'status' => 'active',
        ];
    }

    return $items;
}

function extractAboutAndContact(DOMXPath $xpath, string $baseUrl): array
{
    $aboutTitle = textFromFirst($xpath, "//*[contains(@class,'aboutHoneyTitle')]");
    $aboutText = textFromFirst($xpath, "//*[contains(@class,'aboutHoneyText')]");

    $aboutImageNode = $xpath->query("//*[contains(@class,'aboutHoneyImg')]")->item(0);
    $aboutImage = $aboutImageNode ? resolveUrl((string) $aboutImageNode->getAttribute('src'), $baseUrl) : '';

    $contactAddress = textFromFirst($xpath, "//*[contains(@class,'contactCardTitle') and normalize-space(text())='Our Location']/following-sibling::*[contains(@class,'contactCardText')]");
    if ($contactAddress === '') {
        $contactAddress = 'I-8 Markaz, Islamabad, Pakistan';
    }

    $contactPhone = textFromFirst($xpath, "//*[contains(@class,'contactCardTitle') and normalize-space(text())='Phone']/following-sibling::*[contains(@class,'contactCardText')]");
    if ($contactPhone === '') {
        $contactPhone = '+92 333 8399480';
    }

    $contactEmail = textFromFirst($xpath, "//*[contains(@class,'contactCardTitle') and normalize-space(text())='Email']/following-sibling::*[contains(@class,'contactCardText')]");
    if ($contactEmail === '') {
        $contactEmail = 'info@swiftsigngeneraltrading.com';
    }

    return [
        'settings' => [
            'site_title' => 'Swift Sign Honey & Desi Ghee',
            'site_description' => 'Premium natural honey and desi ghee.',
            'about_title' => $aboutTitle,
            'about_content' => $aboutText,
            'about_image' => downloadImage($aboutImage, 'services'),
            'contact_address' => $contactAddress,
            'contact_phone' => $contactPhone,
            'contact_email' => $contactEmail,
            'whatsapp_number' => '923338399480',
        ],
    ];
}

function insertHeroSlide(PDO $pdo, array $row): void
{
    $stmt = $pdo->prepare('INSERT INTO hero_slides (title, subtitle, button_text, button_link, image_path, order_position, status, created_at, updated_at) VALUES (:title, :subtitle, :button_text, :button_link, :image_path, :order_position, :status, NOW(), NOW())');
    $stmt->execute($row);
}

function insertService(PDO $pdo, array $row): void
{
    $stmt = $pdo->prepare('INSERT INTO services (title, description, icon, image_path, order_position, status, created_at, updated_at) VALUES (:title, :description, :icon, :image_path, :order_position, :status, NOW(), NOW())');
    $stmt->execute($row);
}

function insertProduct(PDO $pdo, array $row): void
{
    $stmt = $pdo->prepare('INSERT INTO products (title, slug, sku, description, price, old_price, badge, rating, image_path, variants_json, order_position, status, meta_title, meta_description, meta_keywords, created_at, updated_at) VALUES (:title, :slug, :sku, :description, :price, :old_price, :badge, :rating, :image_path, :variants_json, :order_position, :status, :meta_title, :meta_description, :meta_keywords, NOW(), NOW())');
    $stmt->execute($row);
}

function insertTestimonial(PDO $pdo, array $row): void
{
    $stmt = $pdo->prepare('INSERT INTO testimonials (name, role, review, rating, avatar_path, order_position, status, created_at, updated_at) VALUES (:name, :role, :review, :rating, :avatar_path, :order_position, :status, NOW(), NOW())');
    $stmt->execute($row);
}

function insertSettings(PDO $pdo, array $settings): void
{
    $position = 1;
    $stmt = $pdo->prepare('INSERT INTO settings (setting_key, setting_value, setting_type, order_position, status, created_at, updated_at) VALUES (:setting_key, :setting_value, :setting_type, :order_position, :status, NOW(), NOW())');

    foreach ($settings as $key => $value) {
        $stmt->execute([
            ':setting_key' => $key,
            ':setting_value' => (string) $value,
            ':setting_type' => 'text',
            ':order_position' => $position++,
            ':status' => 'active',
        ]);
    }
}

function insertStats(PDO $pdo, array $stats): void
{
    $stmt = $pdo->prepare('INSERT INTO stats (label, value, suffix, icon, order_position, status, created_at, updated_at) VALUES (:label, :value, :suffix, :icon, :order_position, :status, NOW(), NOW())');

    foreach ($stats as $idx => $row) {
        $stmt->execute([
            ':label' => $row['label'],
            ':value' => $row['value'],
            ':suffix' => $row['suffix'],
            ':icon' => $row['icon'],
            ':order_position' => $idx + 1,
            ':status' => 'active',
        ]);
    }
}

function createDefaultAdmin(PDO $pdo): void
{
    $passwordA = password_hash('Admin@123', PASSWORD_BCRYPT);
    $passwordB = password_hash('admin123', PASSWORD_BCRYPT);

    $stmt = $pdo->prepare('INSERT INTO admins (name, email, password_hash, status, created_at, updated_at) VALUES (:name, :email, :password_hash, :status, NOW(), NOW())');

    $stmt->execute([
        ':name' => 'admin',
        ':email' => 'admin@swiftsign.com',
        ':password_hash' => $passwordA,
        ':status' => 'active',
    ]);

    $stmt->execute([
        ':name' => 'admin',
        ':email' => 'admin@example.com',
        ':password_hash' => $passwordB,
        ':status' => 'active',
    ]);
}

function downloadImage(string $url, string $folder): string
{
    if ($url === '') {
        return '';
    }

    $uploadsRoot = realpath(__DIR__ . '/..') . '/uploads';
    $targetDir = $uploadsRoot . '/' . trim($folder, '/');

    if (!is_dir($targetDir) && !mkdir($targetDir, 0775, true) && !is_dir($targetDir)) {
        return '';
    }

    $extension = strtolower(pathinfo(parse_url($url, PHP_URL_PATH) ?? '', PATHINFO_EXTENSION));
    if ($extension === '') {
        $extension = 'jpg';
    }

    $filename = uniqid('seed_', true) . '.' . $extension;
    $targetPath = $targetDir . '/' . $filename;

    $imageData = @file_get_contents($url);
    if ($imageData === false) {
        return '';
    }

    file_put_contents($targetPath, $imageData);

    return '/uploads/' . trim($folder, '/') . '/' . $filename;
}

function textFromFirst(DOMXPath $xpath, string $query): string
{
    $node = $xpath->query($query)->item(0);
    if (!$node instanceof DOMNode) {
        return '';
    }

    return trim(preg_replace('/\s+/', ' ', $node->textContent) ?: '');
}

function resolveUrl(string $path, string $base): string
{
    if ($path === '') {
        return '';
    }

    if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
        return $path;
    }

    $base = rtrim($base, '/');

    if (str_starts_with($path, '/')) {
        return $base . $path;
    }

    return $base . '/' . $path;
}

function slugify(string $value): string
{
    $value = strtolower(trim($value));
    $value = preg_replace('/[^a-z0-9]+/', '-', $value) ?: '';
    return trim($value, '-');
}

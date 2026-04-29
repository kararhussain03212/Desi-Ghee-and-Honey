<?php

declare(strict_types=1);

use Backend\Config\Database;
use Backend\Utils\Cache;

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/Cache.php';

$pdo = Database::connection();
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$assetMap = [
    'hero-slider.jpg' => [
        'source' => dirname(__DIR__, 2) . '/src/assets/Slide image/slider.jpeg',
        'target' => dirname(__DIR__) . '/uploads/hero/slider.jpg',
        'public' => '/uploads/hero/slider.jpg',
    ],
    'hero-ghee.jpg' => [
        'source' => dirname(__DIR__, 2) . '/src/assets/Slide image/gheeslider.jpeg',
        'target' => dirname(__DIR__) . '/uploads/hero/gheeslider.jpg',
        'public' => '/uploads/hero/gheeslider.jpg',
    ],
    'product-goat.png' => [
        'source' => dirname(__DIR__, 2) . '/src/assets/images/goat.png',
        'target' => dirname(__DIR__) . '/uploads/products/goat.png',
        'public' => '/uploads/products/goat.png',
    ],
    'product-honey.png' => [
        'source' => dirname(__DIR__, 2) . '/src/assets/images/mockuphoney.png',
        'target' => dirname(__DIR__) . '/uploads/products/mockuphoney.png',
        'public' => '/uploads/products/mockuphoney.png',
    ],
    'product-buffalo.png' => [
        'source' => dirname(__DIR__, 2) . '/src/assets/images/buffalo.png',
        'target' => dirname(__DIR__) . '/uploads/products/buffalo.png',
        'public' => '/uploads/products/buffalo.png',
    ],
    'product-cow.png' => [
        'source' => dirname(__DIR__, 2) . '/src/assets/images/cow.png',
        'target' => dirname(__DIR__) . '/uploads/products/cow.png',
        'public' => '/uploads/products/cow.png',
    ],
    'testimonial-lalajan.jpg' => [
        'source' => dirname(__DIR__, 2) . '/src/assets/images/lalajan.jpeg',
        'target' => dirname(__DIR__) . '/uploads/testimonials/lalajan.jpeg',
        'public' => '/uploads/testimonials/lalajan.jpeg',
    ],
    'testimonial-saeed.jpg' => [
        'source' => dirname(__DIR__, 2) . '/src/assets/images/saeed.jpg',
        'target' => dirname(__DIR__) . '/uploads/testimonials/saeed.jpg',
        'public' => '/uploads/testimonials/saeed.jpg',
    ],
    'testimonial-team2.jpg' => [
        'source' => dirname(__DIR__, 2) . '/src/assets/images/team2.jpg',
        'target' => dirname(__DIR__) . '/uploads/testimonials/team2.jpg',
        'public' => '/uploads/testimonials/team2.jpg',
    ],
    'testimonial-team3.jpg' => [
        'source' => dirname(__DIR__, 2) . '/src/assets/images/team3.jpg',
        'target' => dirname(__DIR__) . '/uploads/testimonials/team3.jpg',
        'public' => '/uploads/testimonials/team3.jpg',
    ],
];

$publicAssets = [];
foreach ($assetMap as $key => $asset) {
    $publicAssets[$key] = copyAsset($asset['source'], $asset['target']) ? $asset['public'] : '';
}

$products = [
    [
        'title' => 'Goat Desi Ghee',
        'slug' => 'goat-desi-ghee',
        'sku' => 'HG-GHEE-001',
        'badge' => '-28%',
        'image_path' => $publicAssets['product-goat.png'],
        'price' => 7000,
        'old_price' => null,
        'variants_json' => json_encode([
            ['label' => '1kg', 'price' => 7000],
            ['label' => '500g', 'price' => 3500],
        ], JSON_UNESCAPED_SLASHES),
        'rating' => 4,
        'order_position' => 1,
    ],
    [
        'title' => 'Honey Small Bees',
        'slug' => 'honey-small-bees',
        'sku' => 'HG-HNY-002',
        'badge' => '-25%',
        'image_path' => $publicAssets['product-honey.png'],
        'price' => 8000,
        'old_price' => null,
        'variants_json' => json_encode([
            ['label' => '1kg', 'price' => 8000],
            ['label' => '500g', 'price' => 4000],
        ], JSON_UNESCAPED_SLASHES),
        'rating' => 3.5,
        'order_position' => 2,
    ],
    [
        'title' => 'Buffalo Ghee',
        'slug' => 'buffalo-ghee',
        'sku' => 'HG-HNY-003',
        'badge' => 'New',
        'image_path' => $publicAssets['product-buffalo.png'],
        'price' => 3600,
        'old_price' => 98,
        'variants_json' => json_encode([
            ['label' => '1kg', 'price' => 3600],
            ['label' => '500g', 'price' => 1800],
        ], JSON_UNESCAPED_SLASHES),
        'rating' => 3,
        'order_position' => 3,
    ],
    [
        'title' => 'Cow Desi Ghee',
        'slug' => 'cow-desi-ghee',
        'sku' => 'HG-HNY-004',
        'badge' => '-20%',
        'image_path' => $publicAssets['product-cow.png'],
        'price' => 4000,
        'old_price' => 98,
        'variants_json' => json_encode([
            ['label' => '1kg', 'price' => 4000],
            ['label' => '500g', 'price' => 2000],
        ], JSON_UNESCAPED_SLASHES),
        'rating' => 4,
        'order_position' => 4,
    ],
];

$heroSlides = [
    [
        'title' => 'FRESH ORGANIC HONEY',
        'subtitle' => null,
        'button_text' => 'SHOP NOW',
        'button_link' => '/product',
        'image_path' => $publicAssets['hero-slider.jpg'],
        'order_position' => 1,
    ],
    [
        'title' => 'PURE NATURAL DESI GHEE',
        'subtitle' => null,
        'button_text' => 'SHOP NOW',
        'button_link' => '/product',
        'image_path' => $publicAssets['hero-ghee.jpg'],
        'order_position' => 2,
    ],
];

$testimonials = [
    [
        'avatar_path' => $publicAssets['testimonial-lalajan.jpg'],
        'name' => 'Lala Jan',
        'role' => 'Verified Customer',
        'review' => "This honey is absolutely pure and natural. I've been my family and the taste is incredible. Highly recommended!",
        'rating' => 5,
        'order_position' => 1,
    ],
    [
        'avatar_path' => $publicAssets['testimonial-saeed.jpg'],
        'name' => 'Saeed Ali',
        'role' => 'Verified Customer',
        'review' => "The desi ghee from this company is the best. It's 100% natural and helps with my daily cooking. Worth every rupee!",
        'rating' => 5,
        'order_position' => 2,
    ],
    [
        'avatar_path' => $publicAssets['testimonial-team2.jpg'],
        'name' => 'Ayesha Ahmed',
        'role' => 'Verified Customer',
        'review' => 'I love the quality and purity of the products. Great customer service and fast delivery. Definitely ordering again!',
        'rating' => 5,
        'order_position' => 3,
    ],
    [
        'avatar_path' => $publicAssets['testimonial-team3.jpg'],
        'name' => 'Fatima Khan',
        'role' => 'Verified Customer',
        'review' => 'The products arrived fresh and pure. Excellent service, quick delivery, and I will order again soon for sure.',
        'rating' => 5,
        'order_position' => 4,
    ],
];

try {
    $pdo->beginTransaction();

    $pdo->exec('DELETE FROM hero_slides');
    $pdo->exec('DELETE FROM testimonials');
    $pdo->exec('DELETE FROM products');

    $insertHero = $pdo->prepare(
        'INSERT INTO hero_slides (title, subtitle, button_text, button_link, image_path, order_position, status, created_at, updated_at)
         VALUES (:title, :subtitle, :button_text, :button_link, :image_path, :order_position, :status, NOW(), NOW())'
    );
    foreach ($heroSlides as $item) {
        $insertHero->execute([
            ':title' => $item['title'],
            ':subtitle' => $item['subtitle'],
            ':button_text' => $item['button_text'],
            ':button_link' => $item['button_link'],
            ':image_path' => $item['image_path'],
            ':order_position' => $item['order_position'],
            ':status' => 'active',
        ]);
    }

    $insertProduct = $pdo->prepare(
        'INSERT INTO products
            (title, slug, sku, description, price, old_price, badge, rating, image_path, variants_json, order_position, status, meta_title, meta_description, meta_keywords, created_at, updated_at)
         VALUES
            (:title, :slug, :sku, :description, :price, :old_price, :badge, :rating, :image_path, :variants_json, :order_position, :status, :meta_title, :meta_description, :meta_keywords, NOW(), NOW())'
    );
    foreach ($products as $item) {
        $insertProduct->execute([
            ':title' => $item['title'],
            ':slug' => $item['slug'],
            ':sku' => $item['sku'],
            ':description' => $item['title'] . ' sourced from SwiftSign General Trading.',
            ':price' => $item['price'],
            ':old_price' => $item['old_price'],
            ':badge' => $item['badge'],
            ':rating' => $item['rating'],
            ':image_path' => $item['image_path'],
            ':variants_json' => $item['variants_json'],
            ':order_position' => $item['order_position'],
            ':status' => 'active',
            ':meta_title' => $item['title'],
            ':meta_description' => $item['title'] . ' - premium quality natural product.',
            ':meta_keywords' => 'honey, desi ghee, natural',
        ]);
    }

    $insertTestimonial = $pdo->prepare(
        'INSERT INTO testimonials (name, role, review, rating, avatar_path, order_position, status, created_at, updated_at)
         VALUES (:name, :role, :review, :rating, :avatar_path, :order_position, :status, NOW(), NOW())'
    );
    foreach ($testimonials as $item) {
        $insertTestimonial->execute([
            ':name' => $item['name'],
            ':role' => $item['role'],
            ':review' => $item['review'],
            ':rating' => $item['rating'],
            ':avatar_path' => $item['avatar_path'],
            ':order_position' => $item['order_position'],
            ':status' => 'active',
        ]);
    }

    $pdo->commit();
    Cache::clearAll();
    echo "Static content seeded successfully.\n";
} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo 'Seeding failed: ' . $e->getMessage() . PHP_EOL;
    exit(1);
}

function copyAsset(string $source, string $target): bool
{
    if (!is_file($source)) {
        return false;
    }

    $dir = dirname($target);
    if (!is_dir($dir) && !mkdir($dir, 0775, true) && !is_dir($dir)) {
        return false;
    }

    return copy($source, $target);
}

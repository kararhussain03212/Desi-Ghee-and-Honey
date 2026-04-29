<?php

declare(strict_types=1);

use Backend\Config\Database;
use Backend\Utils\Cache;

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/Cache.php';

$pdo = Database::connection();
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$assetMap = [
    'about-hero' => [
        'source' => dirname(__DIR__, 2) . '/src/assets/banner/about1.jpeg',
        'target' => dirname(__DIR__) . '/uploads/settings/about-hero.jpeg',
        'public' => '/uploads/settings/about-hero.jpeg',
    ],
    'about-info' => [
        'source' => dirname(__DIR__, 2) . '/src/assets/images/about1.png',
        'target' => dirname(__DIR__) . '/uploads/settings/about-info.png',
        'public' => '/uploads/settings/about-info.png',
    ],
    'about-company' => [
        'source' => dirname(__DIR__, 2) . '/src/assets/images/cow.png',
        'target' => dirname(__DIR__) . '/uploads/settings/about-company.png',
        'public' => '/uploads/settings/about-company.png',
    ],
    'about-category' => [
        'source' => dirname(__DIR__, 2) . '/src/assets/images/mockuphoney.png',
        'target' => dirname(__DIR__) . '/uploads/settings/about-category.png',
        'public' => '/uploads/settings/about-category.png',
    ],
    'process-1' => [
        'source' => dirname(__DIR__, 2) . '/src/assets/icons/icon.png',
        'target' => dirname(__DIR__) . '/uploads/icons/about-process-1.png',
        'public' => '/uploads/icons/about-process-1.png',
    ],
    'process-2' => [
        'source' => dirname(__DIR__, 2) . '/src/assets/images/icon2.png',
        'target' => dirname(__DIR__) . '/uploads/icons/about-process-2.png',
        'public' => '/uploads/icons/about-process-2.png',
    ],
    'process-3' => [
        'source' => dirname(__DIR__, 2) . '/src/assets/icons/guee.png',
        'target' => dirname(__DIR__) . '/uploads/icons/about-process-3.png',
        'public' => '/uploads/icons/about-process-3.png',
    ],
    'process-4' => [
        'source' => dirname(__DIR__, 2) . '/src/assets/icons/honey1.png',
        'target' => dirname(__DIR__) . '/uploads/icons/about-process-4.png',
        'public' => '/uploads/icons/about-process-4.png',
    ],
];

$publicAssets = [];
foreach ($assetMap as $key => $asset) {
    $publicAssets[$key] = copyAsset($asset['source'], $asset['target']) ? $asset['public'] : '';
}

$settings = [
    'about_page_hero_image' => $publicAssets['about-hero'],
    'about_page_title' => 'About Us',
    'about_page_breadcrumb_home' => 'Home',
    'about_page_breadcrumb_current' => 'About',

    'about_page_info_kicker' => 'Information',
    'about_page_info_title' => 'About Honey & Desi Ghee',
    'about_page_info_description' => 'Our honey is collected from natural floral sources and packed with taste and nutrients. Our desi ghee is prepared using traditional methods to deliver rich aroma, purity, and everyday goodness.',
    'about_page_info_image' => $publicAssets['about-info'],

    'about_page_properties_title' => 'Useful Properties Of Honey & Desi Ghee',
    'about_page_properties' => json_encode([
        'Supports Healthy Metabolism',
        'Boosts Natural Immunity',
        'Improves Blood Health',
        'Promotes Better Sleep',
        'Provides Natural Energy & Strength',
    ], JSON_UNESCAPED_SLASHES),

    'about_page_company_kicker' => 'About our Company',
    'about_page_company_title' => 'Cow Desi Ghee',
    'about_page_company_accent' => '100% Natural',
    'about_page_company_suffix' => '& Traditional Goodness',
    'about_page_company_description' => 'Our Pure Cow Desi Ghee is made from 100% natural and fresh cow milk, ensuring premium quality and rich taste. Prepared using traditional methods, this ghee is completely pure, chemical-free, and full of natural aroma and flavor. It enhances the taste of your everyday meals like roti, paratha, rice, and various dishes.',
    'about_page_company_image' => $publicAssets['about-company'],

    'about_page_category_title' => 'Our Honey Category',
    'about_page_category_description' => 'Explore our premium honey collection, carefully selected to bring you the purest taste of nature. Our honey range includes high-quality, 100% natural varieties that are rich in flavor and packed with essential nutrients.',
    'about_page_category_image' => $publicAssets['about-category'],
    'about_page_categories' => json_encode([
        [
            'icon' => 'food',
            'icon_url' => $publicAssets['process-1'],
            'title' => 'Queen Bee Honey',
            'description' => 'Queen Bee Honey is a premium-quality natural honey collected from the finest floral sources.',
        ],
        [
            'icon' => 'apitherapy',
            'icon_url' => $publicAssets['process-2'],
            'title' => 'Sunflower Honey',
            'description' => 'Sunflower Honey is light, golden, and naturally sweet honey made from sunflower blossoms.',
        ],
        [
            'icon' => 'honey',
            'icon_url' => $publicAssets['process-4'],
            'title' => 'Manuka Honey',
            'description' => 'Manuka Honey is a premium and highly valued honey known for its unique quality and rich taste.',
        ],
    ], JSON_UNESCAPED_SLASHES),

    'about_page_process_cards' => json_encode([
        [
            'icon_url' => $publicAssets['process-1'],
            'title' => 'Flowers produce nectar and attract our bees',
            'description' => 'Natural flowers produce nectar, and bees are attracted to collect it from fresh blossoms',
        ],
        [
            'icon_url' => $publicAssets['process-2'],
            'title' => 'Bees collect the nectar and carry it to the beehive',
            'description' => 'Bees carry the collected nectar back to the hive to begin the natural honey-making process',
        ],
        [
            'icon_url' => $publicAssets['process-3'],
            'title' => 'Pure Desi Ghee Naturally Rich & Nutrient-Dense',
            'description' => 'Pure Desi Ghee matures naturally, delivering rich taste and essential nutrients.',
        ],
        [
            'icon_url' => $publicAssets['process-4'],
            'title' => 'Honey is carefully collected for packaging.',
            'description' => 'Honey is carefully harvested from natural sources, and freshness, taste, and nutritional value.',
        ],
    ], JSON_UNESCAPED_SLASHES),

    'section_status_about' => 'active',
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
        $isJson = is_string($value) && (
            str_starts_with($value, '[') ||
            str_starts_with($value, '{')
        );

        $stmt->execute([
            ':setting_key' => (string) $key,
            ':setting_value' => (string) $value,
            ':setting_type' => $isJson ? 'json' : 'text',
            ':order_position' => $position++,
            ':status' => 'active',
        ]);
    }

    $pdo->commit();
    Cache::clearAll();
    echo "About page dynamic settings seeded successfully.\n";
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

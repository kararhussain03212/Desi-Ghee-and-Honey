<?php

declare(strict_types=1);

use Backend\Config\Database;
use Backend\Utils\Cache;

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/Cache.php';

$pdo = Database::connection();
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$assetMap = [
    'hero-slider' => ['source' => dirname(__DIR__, 2) . '/src/assets/Slide image/slider.jpeg', 'target' => dirname(__DIR__) . '/uploads/hero/slider.jpeg', 'public' => '/uploads/hero/slider.jpeg'],
    'hero-ghee' => ['source' => dirname(__DIR__, 2) . '/src/assets/Slide image/gheeslider.jpeg', 'target' => dirname(__DIR__) . '/uploads/hero/gheeslider.jpeg', 'public' => '/uploads/hero/gheeslider.jpeg'],
    'product-goat' => ['source' => dirname(__DIR__, 2) . '/src/assets/images/goat.png', 'target' => dirname(__DIR__) . '/uploads/products/goat.png', 'public' => '/uploads/products/goat.png'],
    'product-honey' => ['source' => dirname(__DIR__, 2) . '/src/assets/images/mockuphoney.png', 'target' => dirname(__DIR__) . '/uploads/products/mockuphoney.png', 'public' => '/uploads/products/mockuphoney.png'],
    'product-buffalo' => ['source' => dirname(__DIR__, 2) . '/src/assets/images/buffalo.png', 'target' => dirname(__DIR__) . '/uploads/products/buffalo.png', 'public' => '/uploads/products/buffalo.png'],
    'product-cow' => ['source' => dirname(__DIR__, 2) . '/src/assets/images/cow.png', 'target' => dirname(__DIR__) . '/uploads/products/cow.png', 'public' => '/uploads/products/cow.png'],
    'testimonial-lalajan' => ['source' => dirname(__DIR__, 2) . '/src/assets/images/lalajan.jpeg', 'target' => dirname(__DIR__) . '/uploads/testimonials/lalajan.jpeg', 'public' => '/uploads/testimonials/lalajan.jpeg'],
    'testimonial-saeed' => ['source' => dirname(__DIR__, 2) . '/src/assets/images/saeed.jpg', 'target' => dirname(__DIR__) . '/uploads/testimonials/saeed.jpg', 'public' => '/uploads/testimonials/saeed.jpg'],
    'testimonial-team2' => ['source' => dirname(__DIR__, 2) . '/src/assets/images/team2.jpg', 'target' => dirname(__DIR__) . '/uploads/testimonials/team2.jpg', 'public' => '/uploads/testimonials/team2.jpg'],
    'testimonial-team3' => ['source' => dirname(__DIR__, 2) . '/src/assets/images/team3.jpg', 'target' => dirname(__DIR__) . '/uploads/testimonials/team3.jpg', 'public' => '/uploads/testimonials/team3.jpg'],
    'about-image' => ['source' => dirname(__DIR__, 2) . '/src/assets/images/about1.png', 'target' => dirname(__DIR__) . '/uploads/settings/about1.png', 'public' => '/uploads/settings/about1.png'],
    'offer-image' => ['source' => dirname(__DIR__, 2) . '/src/assets/images/ghee.png', 'target' => dirname(__DIR__) . '/uploads/settings/ghee.png', 'public' => '/uploads/settings/ghee.png'],
];

$publicAssets = [];
foreach ($assetMap as $key => $asset) {
    $publicAssets[$key] = copyAsset($asset['source'], $asset['target']) ? $asset['public'] : '';
}

$heroSlides = [
    ['title' => 'FRESH ORGANIC HONEY', 'subtitle' => null, 'button_text' => 'SHOP NOW', 'button_link' => '/product', 'image_path' => $publicAssets['hero-slider'], 'order_position' => 1],
    ['title' => 'PURE NATURAL DESI GHEE', 'subtitle' => null, 'button_text' => 'SHOP NOW', 'button_link' => '/product', 'image_path' => $publicAssets['hero-ghee'], 'order_position' => 2],
];

$products = [
    ['title' => 'Goat Desi Ghee', 'slug' => 'goat-desi-ghee', 'sku' => 'HG-GHEE-001', 'badge' => '-28%', 'image_path' => $publicAssets['product-goat'], 'price' => 7000, 'old_price' => null, 'variants_json' => json_encode([['label' => '1kg', 'price' => 7000], ['label' => '500g', 'price' => 3500]], JSON_UNESCAPED_SLASHES), 'rating' => 4, 'order_position' => 1],
    ['title' => 'Honey Small Bees', 'slug' => 'honey-small-bees', 'sku' => 'HG-HNY-002', 'badge' => '-25%', 'image_path' => $publicAssets['product-honey'], 'price' => 8000, 'old_price' => null, 'variants_json' => json_encode([['label' => '1kg', 'price' => 8000], ['label' => '500g', 'price' => 4000]], JSON_UNESCAPED_SLASHES), 'rating' => 3.5, 'order_position' => 2],
    ['title' => 'Buffalo Ghee', 'slug' => 'buffalo-ghee', 'sku' => 'HG-HNY-003', 'badge' => 'New', 'image_path' => $publicAssets['product-buffalo'], 'price' => 3600, 'old_price' => 98, 'variants_json' => json_encode([['label' => '1kg', 'price' => 3600], ['label' => '500g', 'price' => 1800]], JSON_UNESCAPED_SLASHES), 'rating' => 3, 'order_position' => 3],
    ['title' => 'Cow Desi Ghee', 'slug' => 'cow-desi-ghee', 'sku' => 'HG-HNY-004', 'badge' => '-20%', 'image_path' => $publicAssets['product-cow'], 'price' => 4000, 'old_price' => 98, 'variants_json' => json_encode([['label' => '1kg', 'price' => 4000], ['label' => '500g', 'price' => 2000]], JSON_UNESCAPED_SLASHES), 'rating' => 4, 'order_position' => 4],
];

$testimonials = [
    ['avatar_path' => $publicAssets['testimonial-lalajan'], 'name' => 'Lala Jan', 'role' => 'Verified Customer', 'review' => "This honey is absolutely pure and natural. I've been using it with my family and the taste is incredible. Highly recommended!", 'rating' => 5, 'order_position' => 1],
    ['avatar_path' => $publicAssets['testimonial-saeed'], 'name' => 'Saeed Ali', 'role' => 'Verified Customer', 'review' => "The desi ghee from this company is the best. It's 100% natural and helps with my daily cooking. Worth every rupee!", 'rating' => 5, 'order_position' => 2],
    ['avatar_path' => $publicAssets['testimonial-team2'], 'name' => 'Ayesha Ahmed', 'role' => 'Verified Customer', 'review' => 'I love the quality and purity of the products. Great customer service and fast delivery. Definitely ordering again!', 'rating' => 5, 'order_position' => 3],
    ['avatar_path' => $publicAssets['testimonial-team3'], 'name' => 'Fatima Khan', 'role' => 'Verified Customer', 'review' => 'The products arrived fresh and pure. Excellent service, quick delivery, and I will order again soon for sure.', 'rating' => 5, 'order_position' => 4],
];

$settings = [
    'site_brand_text' => 'Swift Sign',
    'site_title' => 'Swift Sign Honey & Desi Ghee',
    'site_description' => 'Premium natural honey and desi ghee.',
    'nav_links' => json_encode([
        ['label' => 'Home', 'path' => '/'],
        ['label' => 'About', 'path' => '/about'],
        ['label' => 'Product', 'path' => '/product'],
        ['label' => 'Contact', 'path' => '/contact'],
    ], JSON_UNESCAPED_SLASHES),
    'nav_cart_label' => 'Cart',
    'nav_cart_path' => '/order',

    'home_about_kicker' => 'Information',
    'home_about_title' => 'About Honey & Desi Ghee',
    'home_about_description' => 'Our honey is collected from natural floral sources and packed with taste and nutrients. Our desi ghee is prepared using traditional methods to deliver rich aroma, purity, and everyday goodness.',
    'home_about_button_text' => 'Read more',
    'home_about_button_link' => '/about',
    'home_about_image' => $publicAssets['about-image'],
    'home_about_properties_title' => 'Useful Properties Of Honey & Desi Ghee',
    'home_about_properties' => json_encode([
        'Supports Healthy Metabolism',
        'Boosts Natural Immunity',
        'Improves Blood Health',
        'Promotes Better Sleep',
        'Provides Natural Energy & Strength',
    ], JSON_UNESCAPED_SLASHES),

    'home_ghee_cards' => json_encode([
        ['icon' => 'cow', 'title' => 'Cow Desi Ghee', 'description' => 'Cow Desi Ghee is made from pure cow milk using traditional methods. Rich in healthy fats, vitamins, and natural nutrients, it supports digestion, boosts energy, and promotes overall health naturally.'],
        ['icon' => 'goat', 'title' => 'Goat Desi Ghee', 'description' => 'Goat Desi Ghee is pure, traditional ghee made from fresh goat milk using natural methods. It has a rich aroma, smooth texture, and authentic taste.'],
        ['icon' => 'buffalo', 'title' => 'Buffalo Desi Ghee', 'description' => 'Buffalo Desi Ghee is pure, traditional ghee made from high-quality buffalo milk using natural methods. It has a rich aroma, thick texture, and strong authentic flavor.'],
    ], JSON_UNESCAPED_SLASHES),

    'home_company_kicker' => 'About our Company',
    'home_company_title' => 'Cow Desi Ghee',
    'home_company_accent' => '100% Natural',
    'home_company_suffix' => '& Traditional Goodness',
    'home_company_text' => 'Our Pure Cow Desi Ghee is made from 100% natural and fresh cow milk, ensuring premium quality and rich taste. Prepared using traditional methods, this ghee is completely pure, chemical-free, and full of natural aroma and flavor.',
    'home_company_button_text' => 'MORE ABOUT',
    'home_company_button_link' => '/about',
    'home_company_image' => $publicAssets['product-cow'],

    'home_products_title' => 'Fresh Desi Ghee & Honey',
    'home_products_description' => 'Experience the purity of our fresh, 100% natural Desi Ghee and Honey. Rich in taste and nutrients, perfect for a healthy and delicious lifestyle.',

    'home_offer_title' => 'Fresh Cow',
    'home_offer_accent' => 'Original Desi Ghee',
    'home_offer_description' => 'Made from fresh and natural ingredients, our Original Desi Ghee offers rich taste and premium quality. Perfect for everyday cooking.',
    'home_offer_button_text' => 'SHOP NOW',
    'home_offer_button_link' => '/product',
    'home_offer_image' => $publicAssets['offer-image'],

    'home_testimonials_title' => 'What Our Clients Say',
    'home_testimonials_description' => 'Our customers love our pure honey and desi ghee. Read what they have to say about their experience.',
    'home_newsletter_title' => 'Subscribe To Our Newsletter',
    'home_newsletter_description' => 'Subscribe to our latest newsletter to get news about special discount.',
    'home_newsletter_button_text' => 'SUBSCRIBE',
    'home_newsletter_placeholder' => 'Email',
    'home_newsletter_success' => 'Thanks! You are subscribed.',
    'home_newsletter_error' => 'Please enter a valid email address.',

    'about_page_hero_image' => $publicAssets['hero-slider'],
    'about_page_title' => 'About Us',
    'about_page_breadcrumb_home' => 'Home',
    'about_page_breadcrumb_current' => 'About',
    'about_page_info_kicker' => 'Information',
    'about_page_info_title' => 'About Honey & Desi Ghee',
    'about_page_info_description' => 'Our honey is collected from natural floral sources and packed with taste and nutrients. Our desi ghee is prepared using traditional methods to deliver rich aroma, purity, and everyday goodness.',
    'about_page_info_image' => $publicAssets['about-image'],
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
    'about_page_company_image' => $publicAssets['product-cow'],
    'about_page_category_title' => 'Our Honey Category',
    'about_page_category_description' => 'Explore our premium honey collection, carefully selected to bring you the purest taste of nature. Our honey range includes high-quality, 100% natural varieties that are rich in flavor and packed with essential nutrients.',
    'about_page_category_image' => $publicAssets['product-honey'],
    'about_page_categories' => json_encode([
        ['icon' => 'food', 'icon_url' => $publicAssets['product-cow'], 'title' => 'Queen Bee Honey', 'description' => 'Queen Bee Honey is a premium-quality natural honey collected from the finest floral sources.'],
        ['icon' => 'apitherapy', 'icon_url' => $publicAssets['product-goat'], 'title' => 'Sunflower Honey', 'description' => 'Sunflower Honey is light, golden, and naturally sweet honey made from sunflower blossoms.'],
        ['icon' => 'honey', 'icon_url' => $publicAssets['product-honey'], 'title' => 'Manuka Honey', 'description' => 'Manuka Honey is a premium and highly valued honey known for its unique quality and rich taste.'],
    ], JSON_UNESCAPED_SLASHES),
    'about_page_process_cards' => json_encode([
        ['icon_url' => '', 'title' => 'Flowers produce nectar and attract our bees', 'description' => 'Natural flowers produce nectar, and bees are attracted to collect it from fresh blossoms'],
        ['icon_url' => '', 'title' => 'Bees collect the nectar and carry it to the beehive', 'description' => 'Bees carry the collected nectar back to the hive to begin the natural honey-making process'],
        ['icon_url' => '', 'title' => 'Pure Desi Ghee Naturally Rich & Nutrient-Dense', 'description' => 'Pure Desi Ghee matures naturally, delivering rich taste and essential nutrients.'],
        ['icon_url' => '', 'title' => 'Honey is carefully collected for packaging.', 'description' => 'Honey is carefully harvested from natural sources, and freshness, taste, and nutritional value.'],
    ], JSON_UNESCAPED_SLASHES),

    'footer_description' => 'SwiftSign General Trading includes a broad range of activities, defined by expertise and industry practices',
    'footer_account_title' => 'MY ACCOUNT',
    'footer_newsletter_title' => 'NEWSLETTER',
    'footer_newsletter_description' => 'You will be notified when SwiftSign General Trading shares something new',
    'footer_links' => json_encode([
        ['label' => 'Home', 'path' => '/'],
        ['label' => 'About', 'path' => '/about'],
        ['label' => 'Product', 'path' => '/product'],
        ['label' => 'Contact', 'path' => '/contact'],
    ], JSON_UNESCAPED_SLASHES),
    'footer_social_links' => json_encode([
        ['label' => 'Facebook', 'url' => '#', 'icon' => 'facebook'],
        ['label' => 'TikTok', 'url' => '#', 'icon' => 'tiktok'],
        ['label' => 'Instagram', 'url' => '#', 'icon' => 'instagram'],
    ], JSON_UNESCAPED_SLASHES),
    'footer_copyright' => 'Copyright © 2026 All Rights Reserved.',
    'footer_credit_text' => 'Swift IT',
    'footer_credit_url' => 'https://it.swiftsignbm.com/',

    'contact_address' => 'I-8 Markaz, Islamabad, Pakistan',
    'contact_phone' => '+92 333 8399480',
    'contact_email' => 'info@swiftsigngeneraltrading.com',
    'whatsapp_number' => '923338399480',
    'whatsapp_tooltip' => 'Chat with us!',
];

try {
    $pdo->beginTransaction();

    $pdo->exec('DELETE FROM hero_slides');
    $pdo->exec('DELETE FROM testimonials');
    $pdo->exec('DELETE FROM products');
    $pdo->exec('DELETE FROM settings');

    $insertHero = $pdo->prepare('INSERT INTO hero_slides (title, subtitle, button_text, button_link, image_path, order_position, status, created_at, updated_at) VALUES (:title, :subtitle, :button_text, :button_link, :image_path, :order_position, :status, NOW(), NOW())');
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

    $insertProduct = $pdo->prepare('INSERT INTO products (title, slug, sku, description, price, old_price, badge, rating, image_path, variants_json, order_position, status, meta_title, meta_description, meta_keywords, created_at, updated_at) VALUES (:title, :slug, :sku, :description, :price, :old_price, :badge, :rating, :image_path, :variants_json, :order_position, :status, :meta_title, :meta_description, :meta_keywords, NOW(), NOW())');
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

    $insertTestimonial = $pdo->prepare('INSERT INTO testimonials (name, role, review, rating, avatar_path, order_position, status, created_at, updated_at) VALUES (:name, :role, :review, :rating, :avatar_path, :order_position, :status, NOW(), NOW())');
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

    $insertSetting = $pdo->prepare('INSERT INTO settings (setting_key, setting_value, setting_type, order_position, status, created_at, updated_at) VALUES (:setting_key, :setting_value, :setting_type, :order_position, :status, NOW(), NOW())');
    $position = 1;
    foreach ($settings as $key => $value) {
        $isJson = is_string($value) && (
            str_starts_with($value, '[') ||
            str_starts_with($value, '{')
        );
        $insertSetting->execute([
            ':setting_key' => $key,
            ':setting_value' => (string) $value,
            ':setting_type' => $isJson ? 'json' : 'text',
            ':order_position' => $position++,
            ':status' => 'active',
        ]);
    }

    $pdo->commit();
    Cache::clearAll();
    echo "Full dynamic site content seeded successfully.\n";
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

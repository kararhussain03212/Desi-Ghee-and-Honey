<?php

declare(strict_types=1);

use Backend\Config\Database;
use Backend\Utils\Cache;

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/Cache.php';

$pdo = Database::connection();
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$heroSource = dirname(__DIR__, 2) . '/src/assets/banner/about1.jpeg';
$heroTarget = dirname(__DIR__) . '/uploads/settings/contact-hero.jpeg';
$heroPublic = '/uploads/settings/contact-hero.jpeg';
$heroPath = copyAsset($heroSource, $heroTarget) ? $heroPublic : '';

$settings = [
    'contact_page_hero_image' => $heroPath,
    'contact_page_title' => 'Contact',
    'contact_page_breadcrumb_home' => 'Home',
    'contact_page_breadcrumb_current' => 'Contact',
    'contact_section_title' => 'Our Contacts',
    'contact_section_description' => 'Swift Sign Trading offers premium Desi Ghee and Natural Honey made from 100% natural ingredients. We ensure quality, freshness, and authentic taste in every product.',
    'contact_location_title' => 'Our Location',
    'contact_location_text' => 'I-8 Markaz I 8 Markaz I-8, Islamabad, Pakistan',
    'contact_phone_title' => 'Phone',
    'contact_phone_text' => '+92 333 8399480',
    'contact_email_title' => 'Email',
    'contact_email_text' => 'info@swiftsigngeneraltrading.com',
    'contact_form_title' => 'Quick Contact Form',
    'contact_form_name_placeholder' => 'Name',
    'contact_form_lastname_placeholder' => 'Lastname',
    'contact_form_email_placeholder' => 'Email',
    'contact_form_subject_placeholder' => 'Subject',
    'contact_form_message_placeholder' => 'Message',
    'contact_form_button_text' => 'SEND MESSAGE',
    'contact_form_whatsapp_prefix' => 'Contact Form Submission',
    'contact_map_title' => 'Map',
    'contact_map_embed_url' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3319.8!2d73.0759443!3d33.6711939!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38df95459918a25f:0x46495cfc8ce0a1a3!2sI-8%20Markaz%2C%20Islamabad%2C%20Pakistan!5e0!3m2!1sen!2spk!4v1713177600000',
    'contact_address' => 'I-8 Markaz, Islamabad, Pakistan',
    'contact_phone' => '+92 333 8399480',
    'contact_email' => 'info@swiftsigngeneraltrading.com',
    'whatsapp_number' => '923338399480',
    'whatsapp_tooltip' => 'Chat with us!',
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
    echo "Contact page dynamic settings seeded successfully.\n";
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

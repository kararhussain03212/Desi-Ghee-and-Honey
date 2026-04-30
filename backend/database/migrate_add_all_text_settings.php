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
    // NavBar fallback texts
    ['nav_link_home', 'Home', 'text'],
    ['nav_link_about', 'About', 'text'],
    ['nav_link_product', 'Product', 'text'],
    ['nav_link_contact', 'Contact', 'text'],

    // Home page - About section
    ['home_about_kicker', 'Information', 'text'],
    ['home_about_title', 'About Honey & Desi Ghee', 'text'],
    ['home_about_description', 'Our honey is collected from natural floral sources and packed with taste and nutrients. Our desi ghee is prepared using traditional methods to deliver rich aroma, purity, and everyday goodness.', 'textarea'],
    ['home_about_button_text', 'Read more', 'text'],
    ['home_about_button_link', '/about', 'text'],
    ['home_about_properties_title', 'Useful Properties Of Honey & Desi Ghee', 'text'],

    // Home page - Company section
    ['home_company_kicker', 'About our Company', 'text'],
    ['home_company_title', 'Cow Desi Ghee', 'text'],
    ['home_company_accent', '100% Natural', 'text'],
    ['home_company_suffix', '& Traditional Goodness', 'text'],
    ['home_company_text', 'Our Pure Cow Desi Ghee is made from 100% natural and fresh cow milk, ensuring premium quality and rich taste. Prepared using traditional methods, this ghee is completely pure, chemical-free, and full of natural aroma and flavor.', 'textarea'],
    ['home_company_button_text', 'MORE ABOUT', 'text'],
    ['home_company_button_link', '/about', 'text'],

    // Home page - Products section
    ['home_products_title', 'Fresh Desi Ghee & Honey', 'text'],
    ['home_products_description', 'Experience the purity of our fresh, 100% natural Desi Ghee and Honey. Rich in taste and nutrients, perfect for a healthy and delicious lifestyle.', 'textarea'],

    // Home page - Offer section
    ['home_offer_title', 'Fresh Cow', 'text'],
    ['home_offer_accent', 'Original Desi Ghee', 'text'],
    ['home_offer_description', 'Made from fresh and natural ingredients, our Original Desi Ghee offers rich taste and premium quality. Perfect for everyday cooking.', 'textarea'],
    ['home_offer_button_text', 'SHOP NOW', 'text'],
    ['home_offer_button_link', '/product', 'text'],

    // Home page - Testimonials section
    ['home_testimonials_title', 'What Our Clients Say', 'text'],
    ['home_testimonials_description', 'Our customers love our pure honey and desi ghee. Read what they have to say about their experience.', 'textarea'],

    // Home page - Newsletter section
    ['home_newsletter_title', 'Subscribe To Our Newsletter', 'text'],
    ['home_newsletter_description', 'Subscribe to our latest newsletter to get news about special discount.', 'textarea'],
    ['home_newsletter_button_text', 'SUBSCRIBE', 'text'],
    ['home_newsletter_placeholder', 'Email', 'text'],
    ['home_newsletter_success', 'Thanks! You are subscribed.', 'text'],
    ['home_newsletter_error', 'Please enter a valid email address.', 'text'],

    // About page
    ['about_page_title', 'About Us', 'text'],
    ['about_page_breadcrumb_home', 'Home', 'text'],
    ['about_page_breadcrumb_current', 'About', 'text'],
    ['about_page_info_kicker', 'Information', 'text'],
    ['about_page_info_title', 'About Honey & Desi Ghee', 'text'],
    ['about_page_info_description', 'Our honey is collected from natural floral sources and packed with taste and nutrients. Our desi ghee is prepared using traditional methods to deliver rich aroma, purity, and everyday goodness.', 'textarea'],
    ['about_page_properties_title', 'Useful Properties Of Honey & Desi Ghee', 'text'],
    ['about_page_company_kicker', 'About our Company', 'text'],
    ['about_page_company_title', 'Cow Desi Ghee', 'text'],
    ['about_page_company_accent', '100% Natural', 'text'],
    ['about_page_company_suffix', '& Traditional Goodness', 'text'],
    ['about_page_company_description', 'Our Pure Cow Desi Ghee is made from 100% natural and fresh cow milk, ensuring premium quality and rich taste. Prepared using traditional methods, this ghee is completely pure, chemical-free, and full of natural aroma and flavor. It enhances the taste of your everyday meals like roti, paratha, rice, and various dishes.', 'textarea'],
    ['about_page_category_title', 'Our Honey Category', 'text'],
    ['about_page_category_description', 'Explore our premium honey collection, carefully selected to bring you the purest taste of nature. Our honey range includes high-quality, 100% natural varieties that are rich in flavor and packed with essential nutrients.', 'textarea'],

    // Product page
    ['product_page_title', 'Product', 'text'],
    ['product_page_breadcrumb_home', 'Home', 'text'],
    ['product_page_breadcrumb_current', 'Product', 'text'],
    ['product_showcase_kicker', 'OUR PRODUCT', 'text'],
    ['product_showcase_title', 'TRY OUT A DIFFERENT HONEY & GHEE TASTE THIS TIME', 'text'],
    ['product_showcase_text', 'SwiftSign General Trading offers a diverse range of premium honey and desi ghee products, carefully sourced and crafted to deliver exceptional taste and quality. With a strong focus on expertise and industry standards, we ensure natural freshness, rich flavor, and reliable quality in every product, giving customers a unique and satisfying experience every time', 'textarea'],
    ['product_catalog_title', 'Fresh Desi Ghee &', 'text'],
    ['product_catalog_title_highlight', 'Honey', 'text'],
    ['product_catalog_description', 'Made from fresh and natural ingredients, our Sunflower Original Desi Ghee offers rich taste and premium quality.', 'textarea'],

    // Contact page
    ['contact_page_title', 'Contact', 'text'],
    ['contact_page_breadcrumb_home', 'Home', 'text'],
    ['contact_page_breadcrumb_current', 'Contact', 'text'],
    ['contact_section_title', 'Our Contacts', 'text'],
    ['contact_section_description', 'Swift Sign Trading offers premium Desi Ghee and Natural Honey made from 100% natural ingredients. We ensure quality, freshness, and authentic taste in every product.', 'textarea'],
    ['contact_location_title', 'Our Location', 'text'],
    ['contact_location_text', 'I-8 Markaz I 8 Markaz I-8, Islamabad, Pakistan', 'text'],
    ['contact_phone_title', 'Phone', 'text'],
    ['contact_phone_text', '+92 333 8399480', 'text'],
    ['contact_email_title', 'Email', 'text'],
    ['contact_email_text', 'info@swiftsigngeneraltrading.com', 'text'],
    ['contact_form_title', 'Quick Contact Form', 'text'],
    ['contact_form_name_placeholder', 'Name', 'text'],
    ['contact_form_lastname_placeholder', 'Lastname', 'text'],
    ['contact_form_email_placeholder', 'Email', 'text'],
    ['contact_form_subject_placeholder', 'Subject', 'text'],
    ['contact_form_message_placeholder', 'Message', 'text'],
    ['contact_form_button_text', 'SEND MESSAGE', 'text'],
    ['contact_form_whatsapp_prefix', 'Contact Form Submission', 'text'],
    ['contact_map_title', 'Map', 'text'],
    ['contact_map_embed_url', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3319.8!2d73.0759443!3d33.6711939!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38df95459918a25f:0x46495cfc8ce0a1a3!2sI-8%20Markaz%2C%20Islamabad%2C%20Pakistan!5e0!3m2!1sen!2spk!4v1713177600000', 'text'],

    // Footer
    ['footer_link_home', 'Home', 'text'],
    ['footer_link_about', 'About', 'text'],
    ['footer_link_product', 'Product', 'text'],
    ['footer_link_contact', 'Contact', 'text'],
    ['footer_contact_title', 'CONTACT', 'text'],
    ['footer_account_title', 'MY ACCOUNT', 'text'],
    ['footer_newsletter_title', 'NEWSLETTER', 'text'],
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
    echo "✓ Migration completed: Added all text settings\n";
    echo "Total settings added: " . count($settings) . "\n";
} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo "✗ Migration failed: " . $e->getMessage() . PHP_EOL;
    exit(1);
}

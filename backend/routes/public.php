<?php

declare(strict_types=1);

use Backend\Controllers\BlogController;
use Backend\Controllers\GalleryController;
use Backend\Controllers\HeroController;
use Backend\Controllers\ProductController;
use Backend\Controllers\ServiceController;
use Backend\Controllers\SettingController;
use Backend\Controllers\StatController;
use Backend\Controllers\TeamController;
use Backend\Controllers\TestimonialController;
use Backend\Utils\Router;

require_once __DIR__ . '/../controllers/HeroController.php';
require_once __DIR__ . '/../controllers/ServiceController.php';
require_once __DIR__ . '/../controllers/ProductController.php';
require_once __DIR__ . '/../controllers/TeamController.php';
require_once __DIR__ . '/../controllers/TestimonialController.php';
require_once __DIR__ . '/../controllers/BlogController.php';
require_once __DIR__ . '/../controllers/GalleryController.php';
require_once __DIR__ . '/../controllers/StatController.php';
require_once __DIR__ . '/../controllers/SettingController.php';
require_once __DIR__ . '/../utils/Router.php';

function registerPublicRoutes(Router $router): void
{
    $router->get('/api/public/hero', [HeroController::class, 'publicIndex']);
    $router->get('/api/public/services', [ServiceController::class, 'publicIndex']);
    $router->get('/api/public/products', [ProductController::class, 'publicIndex']);
    $router->get('/api/public/team', [TeamController::class, 'publicIndex']);
    $router->get('/api/public/testimonials', [TestimonialController::class, 'publicIndex']);
    $router->get('/api/public/blog', [BlogController::class, 'publicIndex']);
    $router->get('/api/public/blog/{slug}', [BlogController::class, 'publicShowBySlug']);
    $router->get('/api/public/gallery', [GalleryController::class, 'publicIndex']);
    $router->get('/api/public/stats', [StatController::class, 'publicIndex']);
    $router->get('/api/public/settings', [SettingController::class, 'publicIndex']);
}

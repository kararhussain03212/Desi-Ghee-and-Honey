<?php

declare(strict_types=1);

use Backend\Controllers\BlogController;
use Backend\Controllers\DashboardController;
use Backend\Controllers\GalleryController;
use Backend\Controllers\HeroController;
use Backend\Controllers\ProductController;
use Backend\Controllers\SearchController;
use Backend\Controllers\ServiceController;
use Backend\Controllers\SettingController;
use Backend\Controllers\StatController;
use Backend\Controllers\TeamController;
use Backend\Controllers\TestimonialController;
use Backend\Controllers\UploadController;
use Backend\Controllers\UserController;
use Backend\Middleware\AuthMiddleware;
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
require_once __DIR__ . '/../controllers/UploadController.php';
require_once __DIR__ . '/../controllers/UserController.php';
require_once __DIR__ . '/../controllers/DashboardController.php';
require_once __DIR__ . '/../controllers/SearchController.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../utils/Router.php';

function registerAdminRoutes(Router $router): void
{
    $mw = [[AuthMiddleware::class, 'requireAuth']];

    $router->get('/api/admin/dashboard', [DashboardController::class, 'stats'], $mw);
    $router->get('/api/admin/search', [SearchController::class, 'global'], $mw);

    // Hero Slides
    $router->get('/api/admin/hero', [HeroController::class, 'index'], $mw);
    $router->get('/api/admin/hero/{id}', [HeroController::class, 'show'], $mw);
    $router->post('/api/admin/hero', [HeroController::class, 'store'], $mw);
    $router->put('/api/admin/hero/{id}', [HeroController::class, 'update'], $mw);
    $router->delete('/api/admin/hero/{id}', [HeroController::class, 'destroy'], $mw);
    $router->patch('/api/admin/hero/reorder', [HeroController::class, 'reorder'], $mw);

    // Services
    $router->get('/api/admin/services', [ServiceController::class, 'index'], $mw);
    $router->get('/api/admin/services/{id}', [ServiceController::class, 'show'], $mw);
    $router->post('/api/admin/services', [ServiceController::class, 'store'], $mw);
    $router->put('/api/admin/services/{id}', [ServiceController::class, 'update'], $mw);
    $router->delete('/api/admin/services/{id}', [ServiceController::class, 'destroy'], $mw);
    $router->patch('/api/admin/services/reorder', [ServiceController::class, 'reorder'], $mw);

    // Products
    $router->get('/api/admin/products', [ProductController::class, 'index'], $mw);
    $router->get('/api/admin/products/{id}', [ProductController::class, 'show'], $mw);
    $router->post('/api/admin/products', [ProductController::class, 'store'], $mw);
    $router->put('/api/admin/products/{id}', [ProductController::class, 'update'], $mw);
    $router->delete('/api/admin/products/{id}', [ProductController::class, 'destroy'], $mw);
    $router->patch('/api/admin/products/reorder', [ProductController::class, 'reorder'], $mw);

    // Team
    $router->get('/api/admin/team', [TeamController::class, 'index'], $mw);
    $router->get('/api/admin/team/{id}', [TeamController::class, 'show'], $mw);
    $router->post('/api/admin/team', [TeamController::class, 'store'], $mw);
    $router->put('/api/admin/team/{id}', [TeamController::class, 'update'], $mw);
    $router->delete('/api/admin/team/{id}', [TeamController::class, 'destroy'], $mw);
    $router->patch('/api/admin/team/reorder', [TeamController::class, 'reorder'], $mw);

    // Testimonials
    $router->get('/api/admin/testimonials', [TestimonialController::class, 'index'], $mw);
    $router->get('/api/admin/testimonials/{id}', [TestimonialController::class, 'show'], $mw);
    $router->post('/api/admin/testimonials', [TestimonialController::class, 'store'], $mw);
    $router->put('/api/admin/testimonials/{id}', [TestimonialController::class, 'update'], $mw);
    $router->delete('/api/admin/testimonials/{id}', [TestimonialController::class, 'destroy'], $mw);
    $router->patch('/api/admin/testimonials/reorder', [TestimonialController::class, 'reorder'], $mw);

    // Blog
    $router->get('/api/admin/blog', [BlogController::class, 'index'], $mw);
    $router->get('/api/admin/blog/{id}', [BlogController::class, 'show'], $mw);
    $router->post('/api/admin/blog', [BlogController::class, 'store'], $mw);
    $router->put('/api/admin/blog/{id}', [BlogController::class, 'update'], $mw);
    $router->delete('/api/admin/blog/{id}', [BlogController::class, 'destroy'], $mw);
    $router->patch('/api/admin/blog/reorder', [BlogController::class, 'reorder'], $mw);

    // Gallery
    $router->get('/api/admin/gallery', [GalleryController::class, 'index'], $mw);
    $router->get('/api/admin/gallery/{id}', [GalleryController::class, 'show'], $mw);
    $router->post('/api/admin/gallery', [GalleryController::class, 'store'], $mw);
    $router->put('/api/admin/gallery/{id}', [GalleryController::class, 'update'], $mw);
    $router->delete('/api/admin/gallery/{id}', [GalleryController::class, 'destroy'], $mw);
    $router->patch('/api/admin/gallery/reorder', [GalleryController::class, 'reorder'], $mw);

    // Stats
    $router->get('/api/admin/stats', [StatController::class, 'index'], $mw);
    $router->get('/api/admin/stats/{id}', [StatController::class, 'show'], $mw);
    $router->post('/api/admin/stats', [StatController::class, 'store'], $mw);
    $router->put('/api/admin/stats/{id}', [StatController::class, 'update'], $mw);
    $router->delete('/api/admin/stats/{id}', [StatController::class, 'destroy'], $mw);
    $router->patch('/api/admin/stats/reorder', [StatController::class, 'reorder'], $mw);

    // Settings
    $router->get('/api/admin/settings', [SettingController::class, 'index'], $mw);
    $router->put('/api/admin/settings', [SettingController::class, 'update'], $mw);

    // Upload
    $router->post('/api/admin/upload', [UploadController::class, 'upload'], $mw);

    // Users
    $router->get('/api/admin/users', [UserController::class, 'index'], $mw);
    $router->get('/api/admin/users/{id}', [UserController::class, 'show'], $mw);
    $router->post('/api/admin/users', [UserController::class, 'store'], $mw);
    $router->put('/api/admin/users/{id}', [UserController::class, 'update'], $mw);
    $router->delete('/api/admin/users/{id}', [UserController::class, 'destroy'], $mw);
}

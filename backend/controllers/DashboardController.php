<?php

declare(strict_types=1);

namespace Backend\Controllers;

use Backend\Config\Database;
use Backend\Models\BlogPost;
use Backend\Models\Gallery;
use Backend\Models\HeroSlide;
use Backend\Models\Product;
use Backend\Models\Service;
use Backend\Models\Stat;
use Backend\Models\TeamMember;
use Backend\Models\Testimonial;
use Backend\Utils\Response;

require_once __DIR__ . '/BaseController.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/HeroSlide.php';
require_once __DIR__ . '/../models/Service.php';
require_once __DIR__ . '/../models/Product.php';
require_once __DIR__ . '/../models/TeamMember.php';
require_once __DIR__ . '/../models/Testimonial.php';
require_once __DIR__ . '/../models/BlogPost.php';
require_once __DIR__ . '/../models/Gallery.php';
require_once __DIR__ . '/../models/Stat.php';
require_once __DIR__ . '/../utils/Response.php';

final class DashboardController extends BaseController
{
    public function stats(array $params = []): void
    {
        $counts = [
            'hero' => (new HeroSlide())->count(),
            'services' => (new Service())->count(),
            'products' => (new Product())->count(),
            'team' => (new TeamMember())->count(),
            'testimonials' => (new Testimonial())->count(),
            'blog' => (new BlogPost())->count(),
            'gallery' => (new Gallery())->count(),
            'stats' => (new Stat())->count(),
        ];

        $pdo = Database::connection();
        $stmt = $pdo->query('SELECT id, action, resource, resource_id, created_at FROM activity_logs ORDER BY created_at DESC LIMIT 20');
        $recent = $stmt->fetchAll() ?: [];

        Response::success([
            'counts' => $counts,
            'recent_activities' => $recent,
        ], 'Dashboard data fetched');
    }
}

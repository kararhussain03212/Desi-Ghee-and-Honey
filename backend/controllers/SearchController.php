<?php

declare(strict_types=1);

namespace Backend\Controllers;

use Backend\Models\BlogPost;
use Backend\Models\Product;
use Backend\Models\Service;
use Backend\Models\TeamMember;
use Backend\Models\Testimonial;
use Backend\Utils\Response;

require_once __DIR__ . '/BaseController.php';
require_once __DIR__ . '/../models/Product.php';
require_once __DIR__ . '/../models/Service.php';
require_once __DIR__ . '/../models/TeamMember.php';
require_once __DIR__ . '/../models/Testimonial.php';
require_once __DIR__ . '/../models/BlogPost.php';
require_once __DIR__ . '/../utils/Response.php';

final class SearchController extends BaseController
{
    public function global(array $params = []): void
    {
        $query = trim((string) ($_GET['q'] ?? ''));

        if ($query === '') {
            Response::success([], 'Empty query');
        }

        $filters = ['search' => $query, 'paginate' => '0'];

        Response::success([
            'products' => (new Product())->all($filters),
            'services' => (new Service())->all($filters),
            'team' => (new TeamMember())->all($filters),
            'testimonials' => (new Testimonial())->all($filters),
            'blog' => (new BlogPost())->all($filters),
        ], 'Search results fetched');
    }
}

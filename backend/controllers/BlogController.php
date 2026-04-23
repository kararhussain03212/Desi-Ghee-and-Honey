<?php

declare(strict_types=1);

namespace Backend\Controllers;

use Backend\Models\BlogPost;
use Backend\Utils\Cache;
use Backend\Utils\Response;

require_once __DIR__ . '/BaseCrudController.php';
require_once __DIR__ . '/../models/BlogPost.php';
require_once __DIR__ . '/../utils/Cache.php';
require_once __DIR__ . '/../utils/Response.php';

final class BlogController extends BaseCrudController
{
    protected string $modelClass = BlogPost::class;
    protected string $resourceName = 'blog';
    protected array $requiredCreateFields = ['title', 'content_html'];

    public function publicShowBySlug(array $params): void
    {
        $slug = (string) ($params['slug'] ?? '');
        if ($slug === '') {
            Response::error('Invalid slug', 422);
        }

        $post = Cache::remember('public:blog:slug:' . $slug, static function () use ($slug) {
            $model = new BlogPost();
            return $model->findBySlug($slug);
        });

        if (!$post || ($post['status'] ?? 'inactive') !== 'active') {
            Response::error('Blog post not found', 404);
        }

        Response::success($post, 'Fetched successfully');
    }
}

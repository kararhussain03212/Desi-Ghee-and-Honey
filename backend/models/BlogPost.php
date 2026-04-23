<?php

declare(strict_types=1);

namespace Backend\Models;

require_once __DIR__ . '/BaseModel.php';

final class BlogPost extends BaseModel
{
    protected string $table = 'blog_posts';
    protected array $fillable = ['title', 'slug', 'excerpt', 'content_html', 'featured_image', 'author_name', 'published_at', 'order_position', 'status', 'meta_title', 'meta_description', 'meta_keywords', 'og_image'];
}

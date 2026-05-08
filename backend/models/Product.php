<?php

declare(strict_types=1);

namespace Backend\Models;

require_once __DIR__ . '/BaseModel.php';

final class Product extends BaseModel
{
    protected string $table = 'products';
    protected array $fillable = ['title', 'slug', 'sku', 'description', 'price', 'old_price', 'badge', 'rating', 'image_path', 'image_alt', 'variants_json', 'order_position', 'status', 'meta_title', 'meta_description', 'meta_keywords'];
}

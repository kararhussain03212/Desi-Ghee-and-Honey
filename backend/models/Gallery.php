<?php

declare(strict_types=1);

namespace Backend\Models;

require_once __DIR__ . '/BaseModel.php';

final class Gallery extends BaseModel
{
    protected string $table = 'gallery_items';
    protected array $fillable = ['title', 'image_path', 'caption', 'order_position', 'status'];
}

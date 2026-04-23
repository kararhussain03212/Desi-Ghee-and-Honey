<?php

declare(strict_types=1);

namespace Backend\Models;

require_once __DIR__ . '/BaseModel.php';

final class Service extends BaseModel
{
    protected string $table = 'services';
    protected array $fillable = ['title', 'description', 'icon', 'image_path', 'order_position', 'status'];
}

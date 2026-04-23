<?php

declare(strict_types=1);

namespace Backend\Models;

require_once __DIR__ . '/BaseModel.php';

final class HeroSlide extends BaseModel
{
    protected string $table = 'hero_slides';
    protected array $fillable = ['title', 'subtitle', 'button_text', 'button_link', 'image_path', 'order_position', 'status'];
}

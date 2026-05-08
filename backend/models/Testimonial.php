<?php

declare(strict_types=1);

namespace Backend\Models;

require_once __DIR__ . '/BaseModel.php';

final class Testimonial extends BaseModel
{
    protected string $table = 'testimonials';
    protected array $fillable = ['name', 'slug', 'role', 'review', 'rating', 'avatar_path', 'avatar_alt', 'order_position', 'status'];
}

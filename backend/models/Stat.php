<?php

declare(strict_types=1);

namespace Backend\Models;

require_once __DIR__ . '/BaseModel.php';

final class Stat extends BaseModel
{
    protected string $table = 'stats';
    protected array $fillable = ['label', 'value', 'suffix', 'icon', 'order_position', 'status'];
}

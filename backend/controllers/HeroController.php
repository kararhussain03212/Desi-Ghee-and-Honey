<?php

declare(strict_types=1);

namespace Backend\Controllers;

use Backend\Models\HeroSlide;

require_once __DIR__ . '/BaseCrudController.php';
require_once __DIR__ . '/../models/HeroSlide.php';

final class HeroController extends BaseCrudController
{
    protected string $modelClass = HeroSlide::class;
    protected string $resourceName = 'hero';
    protected array $requiredCreateFields = ['title', 'image_path'];
}

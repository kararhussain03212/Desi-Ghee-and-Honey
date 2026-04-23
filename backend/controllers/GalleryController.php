<?php

declare(strict_types=1);

namespace Backend\Controllers;

use Backend\Models\Gallery;

require_once __DIR__ . '/BaseCrudController.php';
require_once __DIR__ . '/../models/Gallery.php';

final class GalleryController extends BaseCrudController
{
    protected string $modelClass = Gallery::class;
    protected string $resourceName = 'gallery';
    protected array $requiredCreateFields = ['title', 'image_path'];
}

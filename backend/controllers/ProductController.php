<?php

declare(strict_types=1);

namespace Backend\Controllers;

use Backend\Models\Product;

require_once __DIR__ . '/BaseCrudController.php';
require_once __DIR__ . '/../models/Product.php';

final class ProductController extends BaseCrudController
{
    protected string $modelClass = Product::class;
    protected string $resourceName = 'products';
    protected array $requiredCreateFields = ['title', 'price', 'image_path'];
}

<?php

declare(strict_types=1);

namespace Backend\Controllers;

use Backend\Models\Service;

require_once __DIR__ . '/BaseCrudController.php';
require_once __DIR__ . '/../models/Service.php';

final class ServiceController extends BaseCrudController
{
    protected string $modelClass = Service::class;
    protected string $resourceName = 'services';
    protected array $requiredCreateFields = ['title', 'description'];
}

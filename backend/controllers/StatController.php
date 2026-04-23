<?php

declare(strict_types=1);

namespace Backend\Controllers;

use Backend\Models\Stat;

require_once __DIR__ . '/BaseCrudController.php';
require_once __DIR__ . '/../models/Stat.php';

final class StatController extends BaseCrudController
{
    protected string $modelClass = Stat::class;
    protected string $resourceName = 'stats';
    protected array $requiredCreateFields = ['label', 'value'];
}

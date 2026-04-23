<?php

declare(strict_types=1);

namespace Backend\Controllers;

use Backend\Models\TeamMember;

require_once __DIR__ . '/BaseCrudController.php';
require_once __DIR__ . '/../models/TeamMember.php';

final class TeamController extends BaseCrudController
{
    protected string $modelClass = TeamMember::class;
    protected string $resourceName = 'team';
    protected array $requiredCreateFields = ['name', 'role'];
}

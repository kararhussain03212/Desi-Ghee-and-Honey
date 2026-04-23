<?php

declare(strict_types=1);

namespace Backend\Models;

require_once __DIR__ . '/BaseModel.php';

final class TeamMember extends BaseModel
{
    protected string $table = 'team_members';
    protected array $fillable = ['name', 'role', 'bio', 'image_path', 'facebook_url', 'instagram_url', 'linkedin_url', 'order_position', 'status'];
}

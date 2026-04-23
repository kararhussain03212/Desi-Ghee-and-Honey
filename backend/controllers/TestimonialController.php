<?php

declare(strict_types=1);

namespace Backend\Controllers;

use Backend\Models\Testimonial;

require_once __DIR__ . '/BaseCrudController.php';
require_once __DIR__ . '/../models/Testimonial.php';

final class TestimonialController extends BaseCrudController
{
    protected string $modelClass = Testimonial::class;
    protected string $resourceName = 'testimonials';
    protected array $requiredCreateFields = ['name', 'review'];
}

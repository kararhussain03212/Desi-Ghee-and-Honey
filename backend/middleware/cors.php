<?php

declare(strict_types=1);

namespace Backend\Middleware;

use Backend\Config\Env;

require_once __DIR__ . '/../config/env.php';

final class CorsMiddleware
{
    public static function handle(): void
    {
        Env::load(dirname(__DIR__) . '/.env');
        $allowedOrigins = array_values(array_filter(array_map(
            static fn (string $origin): string => trim($origin),
            explode(',', Env::get('CORS_ALLOW_ORIGIN', '*') ?? '*')
        )));

        $requestOrigin = $_SERVER['HTTP_ORIGIN'] ?? '';
        $allowedOrigin = '*';

        if ($allowedOrigins !== []) {
            if (in_array('*', $allowedOrigins, true)) {
                $allowedOrigin = '*';
            } elseif ($requestOrigin !== '' && in_array($requestOrigin, $allowedOrigins, true)) {
                $allowedOrigin = $requestOrigin;
            } else {
                $allowedOrigin = $allowedOrigins[0];
            }
        }

        header('Access-Control-Allow-Origin: ' . $allowedOrigin);
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-CSRF-Token');
        header('Vary: Origin');

        if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
            http_response_code(204);
            exit;
        }
    }
}

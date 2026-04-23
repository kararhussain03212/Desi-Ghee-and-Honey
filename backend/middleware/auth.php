<?php

declare(strict_types=1);

namespace Backend\Middleware;

use Backend\Utils\Jwt;
use Backend\Utils\Response;
use Throwable;

require_once __DIR__ . '/../utils/Jwt.php';
require_once __DIR__ . '/../utils/Response.php';

final class AuthMiddleware
{
    private static ?array $currentAdmin = null;

    public static function requireAuth(string $method, string $uri, array $params): void
    {
        $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        if (!preg_match('/Bearer\s+(.*)$/i', $header, $matches)) {
            Response::error('Missing authorization token', 401);
        }

        try {
            $payload = Jwt::decode($matches[1]);
        } catch (Throwable $e) {
            Response::error('Unauthorized: ' . $e->getMessage(), 401);
        }

        if (in_array($method, ['POST', 'PUT', 'PATCH', 'DELETE'], true)) {
            $csrfHeader = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
            $expected = (string) ($payload['csrf'] ?? '');
            if ($expected === '' || !hash_equals($expected, $csrfHeader)) {
                Response::error('Invalid CSRF token', 419);
            }
        }

        self::$currentAdmin = [
            'id' => (int) ($payload['sub'] ?? 0),
            'email' => (string) ($payload['email'] ?? ''),
            'name' => (string) ($payload['name'] ?? ''),
            'csrf' => (string) ($payload['csrf'] ?? ''),
        ];
    }

    public static function user(): ?array
    {
        return self::$currentAdmin;
    }
}

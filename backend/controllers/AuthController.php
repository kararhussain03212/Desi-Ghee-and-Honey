<?php

declare(strict_types=1);

namespace Backend\Controllers;

use Backend\Config\Database;
use Backend\Middleware\AuthMiddleware;
use Backend\Models\Admin;
use Backend\Utils\Jwt;
use Backend\Utils\Response;
use Backend\Utils\Validator;

require_once __DIR__ . '/BaseController.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../models/Admin.php';
require_once __DIR__ . '/../utils/Jwt.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';

final class AuthController extends BaseController
{
    private string $rateLimitPath;

    public function __construct()
    {
        $this->rateLimitPath = dirname(__DIR__) . '/storage/login_rate_limit.json';
    }

    public function login(array $params = []): void
    {
        $this->ensureRateLimit();

        $payload = Validator::sanitizeInput($this->body());
        $login = strtolower((string) ($payload['email'] ?? $payload['login'] ?? ''));
        $password = (string) ($payload['password'] ?? '');

        if ($login === '' || $password === '') {
            Response::error('Invalid login credentials', 422);
        }

        $adminModel = new Admin();
        $admin = $adminModel->findByLogin($login);

        if (!$admin || !password_verify($password, (string) ($admin['password_hash'] ?? ''))) {
            Response::error('Invalid login credentials', 401);
        }

        if (($admin['status'] ?? 'active') !== 'active') {
            Response::error('Admin account is inactive', 403);
        }

        $csrfToken = bin2hex(random_bytes(24));
        $token = Jwt::encode([
            'sub' => (int) $admin['id'],
            'email' => (string) $admin['email'],
            'name' => (string) $admin['name'],
            'csrf' => $csrfToken,
        ]);

        $pdo = Database::connection();
        $stmt = $pdo->prepare('UPDATE admins SET last_login_at = NOW(), updated_at = NOW() WHERE id = :id');
        $stmt->execute([':id' => (int) $admin['id']]);

        Response::success([
            'token' => $token,
            'csrf_token' => $csrfToken,
            'admin' => [
                'id' => (int) $admin['id'],
                'name' => (string) $admin['name'],
                'email' => (string) $admin['email'],
            ],
        ], 'Login successful');
    }

    public function logout(array $params = []): void
    {
        Response::success(null, 'Logout successful');
    }

    public function me(array $params = []): void
    {
        $user = AuthMiddleware::user();

        if (!$user) {
            Response::error('Unauthorized', 401);
        }

        Response::success([
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
        ], 'Admin fetched');
    }

    private function ensureRateLimit(): void
    {
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        $now = time();
        $window = 60;
        $maxAttempts = 5;

        if (!is_file($this->rateLimitPath)) {
            file_put_contents($this->rateLimitPath, json_encode([], JSON_UNESCAPED_SLASHES));
        }

        $raw = file_get_contents($this->rateLimitPath) ?: '[]';
        $state = json_decode($raw, true);
        if (!is_array($state)) {
            $state = [];
        }

        $entries = array_filter($state[$ip] ?? [], static fn ($timestamp): bool => ($now - (int) $timestamp) <= $window);

        if (count($entries) >= $maxAttempts) {
            Response::error('Too many login attempts. Try again in 1 minute.', 429);
        }

        $entries[] = $now;
        $state[$ip] = array_values($entries);

        file_put_contents($this->rateLimitPath, json_encode($state, JSON_UNESCAPED_SLASHES));
    }
}

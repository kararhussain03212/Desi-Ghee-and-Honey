<?php

declare(strict_types=1);

namespace Backend\Controllers;

use Backend\Models\Product;
use Backend\Utils\ActivityLogger;
use Backend\Utils\Cache;
use Backend\Utils\Response;
use Backend\Utils\Validator;

require_once __DIR__ . '/BaseCrudController.php';
require_once __DIR__ . '/../models/Product.php';
require_once __DIR__ . '/../utils/ActivityLogger.php';
require_once __DIR__ . '/../utils/Cache.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';

final class ProductController extends BaseCrudController
{
    protected string $modelClass = Product::class;
    protected string $resourceName = 'products';
    protected array $requiredCreateFields = ['title', 'price', 'image_path'];

    public function store(array $params = []): void
    {
        $model = new $this->modelClass();
        $payload = $this->normalizeProductPayload(Validator::sanitizeInput($this->body()));

        $errors = Validator::required($payload, $this->requiredCreateFields);
        if ($errors !== []) {
            Response::error('Validation failed', 422, ['fields' => $errors]);
        }

        if (isset($payload['title']) && !isset($payload['slug'])) {
            $payload['slug'] = $this->slugify((string) $payload['title']);
        }

        $id = $model->create($payload);
        ActivityLogger::log($this->currentAdminId(), 'create', $this->resourceName, $id);
        Cache::clearAll();

        Response::success($model->find($id), 'Created successfully', 201);
    }

    public function update(array $params): void
    {
        $id = (int) ($params['id'] ?? 0);
        if ($id <= 0) {
            Response::error('Invalid resource ID', 422);
        }

        $model = new $this->modelClass();
        if (!$model->find($id)) {
            Response::error('Resource not found', 404);
        }

        $payload = $this->normalizeProductPayload(Validator::sanitizeInput($this->body()));
        if (isset($payload['title']) && !isset($payload['slug'])) {
            $payload['slug'] = $this->slugify((string) $payload['title']);
        }

        $ok = $model->update($id, $payload);
        if (!$ok) {
            Response::error('No changes were applied', 422);
        }

        ActivityLogger::log($this->currentAdminId(), 'update', $this->resourceName, $id);
        Cache::clearAll();
        Response::success($model->find($id), 'Updated successfully');
    }

    private function normalizeProductPayload(array $payload): array
    {
        if (!array_key_exists('variants_json', $payload)) {
            return $payload;
        }

        $raw = (string) ($payload['variants_json'] ?? '[]');
        $decodedEntities = str_replace(
            ['&quot;', '&#039;', '&amp;', '&lt;', '&gt;'],
            ['"', "'", '&', '<', '>'],
            $raw
        );
        $trimmed = trim($decodedEntities) === '' ? '[]' : trim($decodedEntities);
        $decoded = json_decode($trimmed, true);
        if (!is_array($decoded)) {
            Response::error('Invalid variants format. Please provide valid JSON.', 422);
        }

        $normalized = array_values(array_map(
            static fn (array $variant): array => [
                'label' => trim((string) ($variant['label'] ?? '')),
                'price' => (float) ($variant['price'] ?? 0),
            ],
            array_filter($decoded, static fn ($item): bool => is_array($item))
        ));

        $payload['variants_json'] = json_encode($normalized, JSON_UNESCAPED_SLASHES);
        return $payload;
    }
}

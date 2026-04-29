<?php

declare(strict_types=1);

namespace Backend\Utils;

final class FileUpload
{
    private const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'svg'];
    private const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'text/plain'];
    private const MAX_SIZE = 5242880;

    public static function upload(array $file, string $folder): array
    {
        if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
            Response::error('No file uploaded or upload failed', 400);
        }

        $size = (int) ($file['size'] ?? 0);
        if ($size > self::MAX_SIZE) {
            Response::error('File exceeds 5MB size limit', 422);
        }

        $name = (string) ($file['name'] ?? '');
        $tmpPath = (string) ($file['tmp_name'] ?? '');
        $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));

        if (!in_array($ext, self::ALLOWED_EXTENSIONS, true)) {
            Response::error('Invalid file extension. Allowed: jpg, jpeg, png, webp, svg', 422);
        }

        $mime = mime_content_type($tmpPath) ?: '';
        if (!in_array($mime, self::ALLOWED_MIME, true)) {
            Response::error('Invalid file type', 422);
        }

        $dir = dirname(__DIR__) . '/uploads/' . trim($folder, '/');
        if (!is_dir($dir) && !mkdir($dir, 0775, true) && !is_dir($dir)) {
            Response::error('Unable to create upload directory', 500);
        }

        $newName = uniqid('img_', true) . '.' . $ext;
        $target = $dir . '/' . $newName;

        if (!move_uploaded_file($tmpPath, $target)) {
            Response::error('Failed to save file', 500);
        }

        return [
            'filename' => $newName,
            'path' => '/uploads/' . trim($folder, '/') . '/' . $newName,
            'size' => $size,
            'mime' => $mime,
        ];
    }
}

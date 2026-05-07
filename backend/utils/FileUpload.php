<?php

declare(strict_types=1);

namespace Backend\Utils;

final class FileUpload
{
    private const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif', 'jfif', 'avif'];
    private const ALLOWED_MIME = [
        'image/jpeg',
        'image/pjpeg',
        'image/png',
        'image/webp',
        'image/svg+xml',
        'image/gif',
        'image/avif',
        'text/plain', // some SVG files are detected as text/plain on Windows/PHP setups
        'application/octet-stream',
    ];
    private const MAX_SIZE = 5242880;
    private const ALLOWED_FOLDERS = [
        'misc',
        'hero',
        'products',
        'testimonials',
        'settings',
        'icons',
        'profiles',
    ];

    public static function upload(array $file, string $folder): array
    {
        $errorCode = (int) ($file['error'] ?? UPLOAD_ERR_NO_FILE);
        if ($errorCode !== UPLOAD_ERR_OK) {
            if ($errorCode === UPLOAD_ERR_INI_SIZE || $errorCode === UPLOAD_ERR_FORM_SIZE) {
                Response::error('File exceeds server upload limit', 422);
            }
            if ($errorCode === UPLOAD_ERR_NO_FILE) {
                Response::error('file is required', 422);
            }
            Response::error('Upload failed with code: ' . $errorCode, 422);
        }

        $size = (int) ($file['size'] ?? 0);
        if ($size > self::MAX_SIZE) {
            Response::error('File exceeds 5MB size limit', 422);
        }

        $name = (string) ($file['name'] ?? '');
        $tmpPath = (string) ($file['tmp_name'] ?? '');
        $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
        if ($ext === 'jfif') {
            $ext = 'jpg';
        }

        if (!in_array($ext, self::ALLOWED_EXTENSIONS, true)) {
            Response::error('Invalid file extension. Allowed: jpg, jpeg, png, webp, svg, gif, avif', 422);
        }

        if ($tmpPath === '' || !is_file($tmpPath)) {
            Response::error('Uploaded file is missing from temporary storage', 422);
        }

        $mime = mime_content_type($tmpPath) ?: '';
        if (!in_array($mime, self::ALLOWED_MIME, true)) {
            Response::error('Invalid file type: ' . $mime, 422);
        }

        $folder = strtolower(trim($folder, '/'));
        if (!in_array($folder, self::ALLOWED_FOLDERS, true)) {
            $folder = 'misc';
        }

        $dir = dirname(__DIR__) . '/uploads/' . $folder;
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
            'path' => '/uploads/' . $folder . '/' . $newName,
            'size' => $size,
            'mime' => $mime,
        ];
    }
}

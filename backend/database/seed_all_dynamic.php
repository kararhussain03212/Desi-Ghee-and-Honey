<?php

declare(strict_types=1);

/**
 * Run all dynamic seed scripts in order.
 *
 * Each script is executed in a separate PHP process to avoid
 * global function re-declaration conflicts across seed files.
 */

$phpBinary = defined('PHP_BINARY') && PHP_BINARY !== '' ? PHP_BINARY : 'php';
$baseDir = __DIR__;

$scripts = [
    'seed_existing_dynamic_content.php',
    'seed_contact_page_dynamic.php',
    'seed_about_page_dynamic.php',
];

foreach ($scripts as $script) {
    $path = $baseDir . DIRECTORY_SEPARATOR . $script;

    if (!is_file($path)) {
        fwrite(STDERR, "Missing seed script: {$script}" . PHP_EOL);
        exit(1);
    }

    echo PHP_EOL . "==> Running {$script}" . PHP_EOL;

    $cmd = escapeshellarg($phpBinary) . ' ' . escapeshellarg($path);
    passthru($cmd, $exitCode);

    if ($exitCode !== 0) {
        fwrite(STDERR, "Seed failed: {$script} (exit code {$exitCode})" . PHP_EOL);
        exit($exitCode);
    }
}

echo PHP_EOL . "All dynamic seed scripts completed successfully." . PHP_EOL;

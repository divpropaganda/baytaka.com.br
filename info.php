<?php
header('Content-Type: text/plain');
echo "DOCUMENT_ROOT: " . ($_SERVER['DOCUMENT_ROOT'] ?? 'unset') . "\n";
echo "SCRIPT_FILENAME: " . ($_SERVER['SCRIPT_FILENAME'] ?? 'unset') . "\n";
echo "CURRENT_DIR: " . __DIR__ . "\n";
echo "REQUEST_URI: " . ($_SERVER['REQUEST_URI'] ?? 'unset') . "\n";
echo "SERVER_NAME: " . ($_SERVER['SERVER_NAME'] ?? 'unset') . "\n";

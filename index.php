<?php
/**
 * Renderizador direto para index.html
 */
$candidates = [
    __DIR__ . '/index.html',
    __DIR__ . '/index.htm',
    __DIR__ . '/www/index.html',
    __DIR__ . '/www/index.htm'
];

foreach ($candidates as $file) {
    if (file_exists($file)) {
        include $file;
        exit;
    }
}

if (file_exists('index.html')) {
    readfile('index.html');
    exit;
}


<?php
// Baytaka Interiores - Novo Portal
if (file_exists(__DIR__ . '/index.html')) {
    include __DIR__ . '/index.html';
    exit;
}
header("Location: index.html");
exit;

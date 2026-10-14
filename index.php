<?php
/**
 * Roteamento transparente para a pasta pública /www/
 * Garante que http://baytaka.com.br/ abra o site imediatamente sem erro 403
 */
$wwwIndex = __DIR__ . '/www/index.html';
$wwwHtm   = __DIR__ . '/www/index.htm';

if (file_exists($wwwIndex)) {
    require_once $wwwIndex;
    exit;
}

if (file_exists($wwwHtm)) {
    require_once $wwwHtm;
    exit;
}

// Fallback caso seja acessado diretamente de dentro da pasta www
if (file_exists(__DIR__ . '/index.html')) {
    require_once __DIR__ . '/index.html';
    exit;
}

header("Location: /www/");
exit;

<?php
header('Content-Type: text/plain');

$docRoot = '/home/baytaka/www';
$subWww = '/home/baytaka/www/www';

echo "DocRoot: $docRoot\n";
echo "SubWww: $subWww\n";

function copyDir($src, $dst) {
    if (!is_dir($src)) return;
    if (!is_dir($dst)) {
        @mkdir($dst, 0755, true);
    }
    $dir = opendir($src);
    if (!$dir) return;
    while (false !== ($file = readdir($dir))) {
        if ($file === '.' || $file === '..' || $file === '.ftpaccess' || $file === 'www') continue;
        $srcPath = "$src/$file";
        $dstPath = "$dst/$file";
        if (is_dir($srcPath)) {
            copyDir($srcPath, $dstPath);
        } else {
            @copy($srcPath, $dstPath);
        }
    }
    closedir($dir);
}

// 1. Copia tudo que foi enviado via FTP (/home/baytaka/www/www) para a raiz pública (/home/baytaka/www)
if (is_dir($subWww)) {
    echo "Copiando arquivos de $subWww para $docRoot...\n";
    copyDir($subWww, $docRoot);
    echo "Copia de /www para raiz concluida com sucesso!\n";
}

// 2. Espelha imagens de produtos e categorias da raiz para /novo instantaneamente no servidor
$rootAssets = $docRoot . '/assets/images';
$novoAssets = $docRoot . '/novo/assets/images';
if (is_dir($rootAssets)) {
    echo "Sincronizando $rootAssets -> $novoAssets...\n";
    copyDir($rootAssets, $novoAssets);
    echo "Imagens sincronizadas em /novo/assets/images com sucesso!\n";
}

echo "\n--- Sincronizacao concluida com sucesso ---\n";

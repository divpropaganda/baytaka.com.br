<?php
header('Content-Type: text/plain');

$docRoot = '/home/baytaka/www';
$subWww = '/home/baytaka/www/www';

echo "DocRoot: $docRoot\n";
echo "SubWww: $subWww\n";

function copyDir($src, $dst) {
    if (!is_dir($dst)) {
        mkdir($dst, 0755, true);
    }
    $dir = opendir($src);
    if (!$dir) return;
    while (false !== ($file = readdir($dir))) {
        if ($file === '.' || $file === '..') continue;
        if ($file === 'www') continue;
        $srcPath = "$src/$file";
        $dstPath = "$dst/$file";
        if (is_dir($srcPath)) {
            copyDir($srcPath, $dstPath);
        } else {
            copy($srcPath, $dstPath);
            chmod($dstPath, 0644);
        }
    }
    closedir($dir);
}

if (is_dir($subWww)) {
    echo "Copiando arquivos de $subWww para $docRoot...\n";
    copyDir($subWww, $docRoot);
    echo "Copia concluida com sucesso!\n";
}

echo "\n--- Conteudo de $docRoot apos sincronizacao ---\n";
print_r(scandir($docRoot));

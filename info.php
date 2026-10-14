<?php
header('Content-Type: text/plain');
echo "DOCUMENT_ROOT: " . (isset($_SERVER['DOCUMENT_ROOT']) ? $_SERVER['DOCUMENT_ROOT'] : 'unset') . "\n";
echo "SCRIPT_FILENAME: " . (isset($_SERVER['SCRIPT_FILENAME']) ? $_SERVER['SCRIPT_FILENAME'] : 'unset') . "\n";
echo "CURRENT_DIR: " . __DIR__ . "\n";

echo "\n--- scandir(/home/baytaka/www) ---\n";
if (is_dir('/home/baytaka/www')) {
    print_r(scandir('/home/baytaka/www'));
} else {
    echo "Nao eh diretorio\n";
}

echo "\n--- scandir(/home/baytaka/www/www) ---\n";
if (is_dir('/home/baytaka/www/www')) {
    print_r(scandir('/home/baytaka/www/www'));
} else {
    echo "Nao eh diretorio\n";
}

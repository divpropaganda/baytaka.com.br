import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const IGNORED_ROOT_DIRS = new Set(['.git', '.github', 'scripts', 'node_modules']);
const IGNORED_FILES = new Set(['.gitignore', 'serve.ps1', 'package.json', 'package-lock.json']);

function getAllFiles(dir, base = '') {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (!base && IGNORED_ROOT_DIRS.has(entry.name)) {
      continue;
    }
    if (!base && IGNORED_FILES.has(entry.name)) {
      continue;
    }
    if (entry.name.startsWith('.git')) {
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    const relPath = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      results = results.concat(getAllFiles(fullPath, relPath));
    } else if (entry.isFile()) {
      results.push(relPath);
    }
  }
  return results;
}

function upload(localPath, remoteUrl, user, pass, method = 'nocwd') {
  const args = [
    '-v',
    '-sS',
    '--show-error',
    '-k',
    '--disable-epsv',
    '--ftp-pasv',
    '--ftp-skip-pasv-ip',
    '--ftp-method', method,
    '--ftp-create-dirs',
    '--connect-timeout', '30',
    '-T', localPath,
    remoteUrl,
    '-u', `${user}:${pass}`
  ];

  const result = spawnSync('curl', args, { stdio: 'inherit' });
  return result.status === 0;
}

function deploy() {
  const host = process.env.FTP || process.env.FTP_SERVER;
  const user = process.env.USER || process.env.FTP_USERNAME;
  const password = process.env.SENHA || process.env.FTP_PASSWORD;

  if (!host || !user || !password) {
    console.error('❌ Erro: Secrets FTP, USER ou SENHA ausentes.');
    process.exit(1);
  }

  const rootDir = process.cwd();
  const cleanHost = host.replace(/^ftp:\/\//, '').replace(/\/$/, '');
  const files = getAllFiles(rootDir);

  console.log(`📦 Encontrados ${files.length} arquivos para publicação.`);
  console.log(`🔐 Autenticando com usuário ${user} em ${cleanHost}...`);

  const testFile = 'index.html';
  const testLocal = path.join(rootDir, testFile);

  let chosenMethod = 'nocwd';
  let chosenPrefix = `ftp://${cleanHost}/`;

  // Teste 1: direto na raiz
  console.log(`\n--- Tentativa 1: nocwd em ftp://${cleanHost}/${testFile} ---`);
  let ok = upload(testLocal, `ftp://${cleanHost}/${testFile}`, user, password, 'nocwd');

  if (!ok) {
    // Teste 2: subpasta www com singlecwd
    console.log(`\n--- Tentativa 2: singlecwd em ftp://${cleanHost}/www/${testFile} ---`);
    ok = upload(testLocal, `ftp://${cleanHost}/www/${testFile}`, user, password, 'singlecwd');
    if (ok) {
      chosenMethod = 'singlecwd';
      chosenPrefix = `ftp://${cleanHost}/www/`;
    }
  }

  if (!ok) {
    // Teste 3: subpasta public_html com singlecwd
    console.log(`\n--- Tentativa 3: singlecwd em ftp://${cleanHost}/public_html/${testFile} ---`);
    ok = upload(testLocal, `ftp://${cleanHost}/public_html/${testFile}`, user, password, 'singlecwd');
    if (ok) {
      chosenMethod = 'singlecwd';
      chosenPrefix = `ftp://${cleanHost}/public_html/`;
    }
  }

  if (!ok) {
    // Teste 4: raiz com singlecwd
    console.log(`\n--- Tentativa 4: singlecwd em ftp://${cleanHost}/${testFile} ---`);
    ok = upload(testLocal, `ftp://${cleanHost}/${testFile}`, user, password, 'singlecwd');
    if (ok) {
      chosenMethod = 'singlecwd';
      chosenPrefix = `ftp://${cleanHost}/`;
    }
  }

  if (!ok) {
    console.error('\n❌ Todos os métodos de envio falharam. Verifique o host FTP e credenciais.');
    process.exit(1);
  }

  console.log(`\n🎉 MÉTODO VALIDADO! Enviando os ${files.length} arquivos com ${chosenMethod} para ${chosenPrefix}...`);

  let success = 0;
  let fail = 0;

  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const localPath = path.join(rootDir, f);
    const remoteUrl = `${chosenPrefix}${f}`;
    const kb = (fs.statSync(localPath).size / 1024).toFixed(1);

    console.log(`[${i + 1}/${files.length}] 📤 ${f} (${kb} KB)...`);
    const res = spawnSync('curl', [
      '-sS',
      '--show-error',
      '-k',
      '--disable-epsv',
      '--ftp-pasv',
      '--ftp-skip-pasv-ip',
      '--ftp-method', chosenMethod,
      '--ftp-create-dirs',
      '--retry', '3',
      '--connect-timeout', '30',
      '-T', localPath,
      remoteUrl,
      '-u', `${user}:${password}`
    ], { stdio: 'inherit' });

    if (res.status === 0) {
      success++;
    } else {
      console.error(`  ❌ Falha: ${f}`);
      fail++;
    }
  }

  if (fail > 0) {
    console.error(`\n❌ Finalizado com ${fail} erros.`);
    process.exit(1);
  }

  console.log(`\n🎉 SUCESSO TOTAL! Todos os ${success} arquivos publicados com sucesso via FTP.`);
}

deploy();

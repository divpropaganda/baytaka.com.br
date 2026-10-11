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

function upload(localPath, remoteUrl, user, pass, method = 'nocwd', useSsl = false) {
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
    '--connect-timeout', '30'
  ];

  if (useSsl) {
    args.push('--ssl');
  }

  args.push('-T', localPath, remoteUrl, '-u', `${user}:${pass}`);

  const result = spawnSync('curl', args, { stdio: 'inherit' });
  return result.status === 0;
}

function deploy() {
  const rawHost = process.env.FTP || process.env.FTP_SERVER || '';
  const rawUser = process.env.USER || process.env.FTP_USERNAME || '';
  const rawPass = process.env.SENHA || process.env.FTP_PASSWORD || '';

  if (!rawHost || !rawUser || !rawPass) {
    console.error('❌ Erro: Secrets FTP, USER ou SENHA ausentes.');
    process.exit(1);
  }

  const rootDir = process.cwd();
  const cleanHost = rawHost.replace(/^ftp:\/\//, '').replace(/\/$/, '').trim();
  const cleanUser = rawUser.trim();
  let cleanPass = rawPass.trim();

  // Se o usuário colocou a senha entre aspas ao salvar no GitHub
  const passCandidates = [cleanPass];
  if ((cleanPass.startsWith('"') && cleanPass.endsWith('"')) || (cleanPass.startsWith("'") && cleanPass.endsWith("'"))) {
    passCandidates.push(cleanPass.slice(1, -1));
  }

  const hostCandidates = [cleanHost];
  if (cleanHost !== 'web15f18.uni5.net') {
    hostCandidates.push('web15f18.uni5.net');
  }

  const files = getAllFiles(rootDir);
  console.log(`📦 Encontrados ${files.length} arquivos para publicação.`);

  const testFile = 'index.html';
  const testLocal = path.join(rootDir, testFile);

  let chosenMethod = 'singlecwd';
  let chosenPrefix = '';
  let chosenPass = cleanPass;
  let chosenHost = cleanHost;
  let chosenSsl = false;
  let ok = false;

  // Prioridade de pastas: public_html (Locaweb padrão), www, ou raiz
  const pathsToTest = ['public_html/', 'www/', ''];

  console.log(`🔍 Testando conexões e modos de envio para Locaweb...`);

  outerLoop:
  for (const h of hostCandidates) {
    for (const p of passCandidates) {
      for (const useSsl of [false, true]) {
        for (const subPath of pathsToTest) {
          for (const method of ['singlecwd', 'nocwd']) {
            const remoteUrl = `ftp://${h}/${subPath}${testFile}`;
            console.log(`\n--- Testando: host=${h} | path=${subPath || '(raiz)'} | ssl=${useSsl} | method=${method} ---`);
            ok = upload(testLocal, remoteUrl, cleanUser, p, method, useSsl);
            if (ok) {
              chosenHost = h;
              chosenPass = p;
              chosenSsl = useSsl;
              chosenMethod = method;
              chosenPrefix = `ftp://${h}/${subPath}`;
              break outerLoop;
            }
          }
        }
      }
    }
  }

  if (!ok) {
    console.error('\n❌ Todos os métodos de envio falharam. Verifique se o usuário ou a senha de FTP estão corretos no painel da Locaweb.');
    process.exit(1);
  }

  console.log(`\n🎉 MÉTODO VALIDADO! Enviando os ${files.length} arquivos para ${chosenPrefix} (ssl=${chosenSsl})...`);

  let success = 0;
  let fail = 0;

  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const localPath = path.join(rootDir, f);
    const remoteUrl = `${chosenPrefix}${f}`;
    const kb = (fs.statSync(localPath).size / 1024).toFixed(1);

    console.log(`[${i + 1}/${files.length}] 📤 ${f} (${kb} KB)...`);
    const args = [
      '-sS',
      '--show-error',
      '-k',
      '--disable-epsv',
      '--ftp-pasv',
      '--ftp-skip-pasv-ip',
      '--ftp-method', chosenMethod,
      '--ftp-create-dirs',
      '--retry', '3',
      '--connect-timeout', '30'
    ];

    if (chosenSsl) {
      args.push('--ssl');
    }

    args.push('-T', localPath, remoteUrl, '-u', `${cleanUser}:${chosenPass}`);

    const res = spawnSync('curl', args, { stdio: 'inherit' });

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

  console.log(`\n🎉 SUCESSO TOTAL! Todos os ${success} arquivos publicados com sucesso na Locaweb.`);
}

deploy();

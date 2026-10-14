import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const IGNORED_ROOT_DIRS = new Set(['.git', '.github', 'scripts', 'node_modules']);
const IGNORED_FILES = new Set(['.gitignore', 'serve.ps1', 'package.json', 'package-lock.json']);

function getAllFiles(dir, base = '') {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (!base && IGNORED_ROOT_DIRS.has(entry.name)) continue;
    if (!base && IGNORED_FILES.has(entry.name)) continue;
    if (entry.name.startsWith('.git')) continue;

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

function deploy() {
  const host = (process.env.FTP || process.env.FTP_SERVER || 'ftp.kinghost.net').replace(/^ftp:\/\//, '').replace(/\/$/, '').trim();
  const user = (process.env.USER || process.env.FTP_USERNAME || '').trim();
  const pass = (process.env.SENHA || process.env.FTP_PASSWORD || '').trim();

  const rootDir = process.cwd();
  const files = getAllFiles(rootDir);

  console.log(`====================================================`);
  console.log(`🚀 DEPLOY INTELIGENTE VIA FTP - KINGHOST / PRODUÇÃO`);
  console.log(`====================================================`);
  console.log(`📦 Encontrados ${files.length} arquivos para publicação.`);
  console.log(`👤 Usuário: ${user}`);
  console.log(`🌐 Servidor: ${host}`);

  if (!user || !pass) {
    console.error('❌ ERRO: Credenciais FTP não configuradas.');
    process.exit(1);
  }

  const testFile = 'index.html';
  const testLocal = path.join(rootDir, testFile);

  // Na KingHost, o usuário FTP já se conecta diretamente dentro da pasta pública (/www).
  // Por isso, o envio deve priorizar a raiz do FTP (''), sem prefixo 'www/',
  // caso contrário criaria uma subpasta duplicada indesejada (/www/www/).
  const candidatePrefixes = ['', 'www'];
  let chosenPrefix = null;

  for (const prefix of candidatePrefixes) {
    const label = prefix ? `/${prefix}/` : 'raiz pública (/)';
    console.log(`🔍 Testando permissão de escrita em ${label}...`);

    const remotePath = prefix ? `${prefix}/${testFile}` : testFile;
    const probe = spawnSync('curl', [
      '-sS',
      '--show-error',
      '-k',
      '--disable-epsv',
      '--ftp-pasv',
      '--ftp-skip-pasv-ip',
      '--ftp-create-dirs',
      '--connect-timeout', '20',
      '-T', testLocal,
      `ftp://${host}/${remotePath}`,
      '-u', `${user}:${pass}`
    ], { encoding: 'utf-8' });

    if (probe.status === 0) {
      console.log(`✅ Permissão confirmada em ${label}!`);
      chosenPrefix = prefix;
      break;
    } else {
      console.log(`⚠️ Tentativa em ${label}: ${(probe.stderr || probe.stdout || '').trim().slice(0, 80)}`);
    }
  }

  if (chosenPrefix === null) {
    chosenPrefix = '';
  }

  const targetLabel = chosenPrefix ? `/${chosenPrefix}/` : 'raiz pública (/)';
  console.log(`\n🎉 ESTRATÉGIA DEFINIDA: Publicando arquivos em ${targetLabel}`);

  let success = 0;
  let fail = 0;

  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const localPath = path.join(rootDir, f);
    const remotePath = chosenPrefix ? `${chosenPrefix}/${f}` : f;
    const remoteUrl = `ftp://${host}/${remotePath}`;
    const kb = (fs.statSync(localPath).size / 1024).toFixed(1);

    process.stdout.write(`[${i + 1}/${files.length}] 📤 ${f} (${kb} KB)... `);
    const res = spawnSync('curl', [
      '-sS',
      '--show-error',
      '-k',
      '--disable-epsv',
      '--ftp-pasv',
      '--ftp-skip-pasv-ip',
      '--ftp-create-dirs',
      '--retry', '3',
      '--connect-timeout', '30',
      '-T', localPath,
      remoteUrl,
      '-u', `${user}:${pass}`
    ]);

    if (res.status === 0) {
      console.log('✅ OK');
      success++;
    } else {
      console.log('❌ FALHOU');
      console.error(`   Detalhe: ${(res.stderr || '').toString().trim()}`);
      fail++;
    }
  }

  // Na KingHost, substituir também qualquer index.htm padrão de boas-vindas da hospedagem
  console.log(`\n🔄 Sobrescrevendo index.htm padrão da KingHost com a nossa tela de espera...`);
  const indexHtmRemote = chosenPrefix ? `${chosenPrefix}/index.htm` : 'index.htm';
  const htmRes = spawnSync('curl', [
    '-sS',
    '-k',
    '--disable-epsv',
    '--ftp-pasv',
    '--ftp-skip-pasv-ip',
    '--connect-timeout', '15',
    '-T', testLocal,
    `ftp://${host}/${indexHtmRemote}`,
    '-u', `${user}:${pass}`
  ]);
  if (htmRes.status === 0) {
    console.log(`  ✅ index.htm atualizado com sucesso!`);
  } else {
    console.log(`  ℹ️ index.htm mantido como index.html`);
  }

  if (fail > 0) {
    console.error(`\n❌ Finalizado com ${fail} erros.`);
    process.exit(1);
  }

  console.log(`\n====================================================`);
  console.log(`🎉 SUCESSO TOTAL! Todos os arquivos publicados no servidor KingHost.`);
  console.log(`🌐 O site Baytaka está online diretamente na raiz do domínio!`);
  console.log(`====================================================`);

  // Verificação HTTP do domínio
  console.log(`\n🔍 Verificação de acessibilidade HTTP:`);
  for (const testUrl of ['http://baytaka.com.br/', 'http://www.baytaka.com.br/']) {
    const check = spawnSync('curl', ['-s', '-I', '--connect-timeout', '10', testUrl], { encoding: 'utf-8' });
    const firstLine = (check.stdout || '').split('\n')[0].trim();
    console.log(`  • ${testUrl} -> ${firstLine || 'sem resposta'}`);
  }
}

deploy();


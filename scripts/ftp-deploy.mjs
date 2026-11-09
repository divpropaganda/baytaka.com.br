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
    // Evita enviar duplicado novo/assets/images via FTP pois sync.php espelha localmente no servidor
    if (relPath.startsWith('novo/assets/images')) continue;

    if (entry.isDirectory()) {
      results = results.concat(getAllFiles(fullPath, relPath));
    } else if (entry.isFile()) {
      results.push(relPath);
    }
  }
  return results;
}

function getDirPriority(dir) {
  if (dir === '') return 0;
  if (dir === 'novo') return 1;
  if (dir === 'novo/data' || dir === 'data') return 2;
  if (dir === 'novo/js' || dir === 'js') return 3;
  if (dir === 'novo/css' || dir === 'css') return 4;
  if (dir === 'assets/images') return 5;
  return 6;
}

function uploadBatch(host, user, pass, dir, relFiles) {
  const remoteDirUrl = dir ? `ftp://${host}/${dir}/` : `ftp://${host}/`;
  const globArg = relFiles.length === 1 ? relFiles[0] : `{${relFiles.join(',')}}`;
  const res = spawnSync('curl', [
    '-sS',
    '--show-error',
    '-k',
    '--disable-epsv',
    '--ftp-pasv',
    '--ftp-skip-pasv-ip',
    '--ftp-create-dirs',
    '--retry', '3',
    '--connect-timeout', '25',
    '-T', globArg,
    remoteDirUrl,
    '-u', `${user}:${pass}`
  ], { encoding: 'utf-8' });
  return { ok: res.status === 0, stderr: (res.stderr || '').trim() };
}

function triggerServerSync() {
  console.log(`\n🔄 Disparando sincronizador nativo do servidor (www/sync.php)...`);
  for (const syncUrl of [
    'https://www.baytaka.com.br/www/sync.php',
    'http://baytaka.com.br/www/sync.php',
    'https://www.baytaka.com.br/sync.php'
  ]) {
    const syncRes = spawnSync('curl', ['-sL', '--connect-timeout', '30', syncUrl], { encoding: 'utf-8' });
    if (syncRes.stdout && syncRes.stdout.trim()) {
      console.log(`--- Saída de ${syncUrl} ---`);
      console.log(syncRes.stdout.trim());
      break;
    }
  }
}

function deploy() {
  const host = (process.env.FTP || process.env.FTP_SERVER || 'ftp.kinghost.net').replace(/^ftp:\/\//, '').replace(/\/$/, '').trim();
  const user = (process.env.USER || process.env.FTP_USERNAME || '').trim();
  const pass = (process.env.SENHA || process.env.FTP_PASSWORD || '').trim();

  if (!user || !pass) {
    console.error('❌ ERRO: Credenciais FTP não configuradas.');
    process.exit(1);
  }

  const rootDir = process.cwd();
  const files = getAllFiles(rootDir);

  const byDir = new Map();
  for (const f of files) {
    const idx = f.lastIndexOf('/');
    const dir = idx >= 0 ? f.slice(0, idx) : '';
    if (!byDir.has(dir)) byDir.set(dir, []);
    byDir.get(dir).push(f);
  }

  const sortedDirs = Array.from(byDir.keys()).sort((a, b) => {
    const pa = getDirPriority(a);
    const pb = getDirPriority(b);
    if (pa !== pb) return pa - pb;
    return a.localeCompare(b);
  });

  console.log(`====================================================`);
  console.log(`🚀 DEPLOY EM LOTE (KEEP-ALIVE) VIA FTP - KINGHOST`);
  console.log(`====================================================`);

  const BATCH_SIZE = 35;
  let totalSent = 0;
  let totalFailed = 0;

  for (const dir of sortedDirs) {
    // Se todas as 383 imagens de produtos já estão em /www/assets/images/produtos, pula reenvio desnecessário
    if (dir === 'assets/images/produtos' && process.env.FORCE_IMAGES !== '1') {
      const checkImg = spawnSync('curl', [
        '-sI', '--connect-timeout', '10',
        'https://www.baytaka.com.br/www/assets/images/produtos/cutout-p145-arcos-e-portais-portal-versailles-p145.jpg'
      ], { encoding: 'utf-8' });
      if ((checkImg.stdout || '').includes('200 OK')) {
        console.log(`\n⚡ Diretório assets/images/produtos (383 fotos) já presente no servidor! Pulando reenvio FTP e sincronizando via sync.php...`);
        continue;
      }
    }

    const dirFiles = byDir.get(dir);
    const label = dir || '(raiz /)';
    console.log(`\n📁 Diretório ${label} (${dirFiles.length} arquivos)...`);

    for (let i = 0; i < dirFiles.length; i += BATCH_SIZE) {
      const batch = dirFiles.slice(i, i + BATCH_SIZE);
      process.stdout.write(`  📤 Lote ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(dirFiles.length / BATCH_SIZE)} (${batch.length} arqs)... `);
      const res = uploadBatch(host, user, pass, dir, batch);
      if (res.ok) {
        console.log(`✅ OK`);
        totalSent += batch.length;
      } else {
        console.log(`⚠️ Falha no lote (${res.stderr}), enviando individualmente...`);
        for (const singleFile of batch) {
          const singleRes = uploadBatch(host, user, pass, dir, [singleFile]);
          if (singleRes.ok) {
            totalSent++;
          } else {
            console.error(`    ❌ Falhou: ${singleFile} -> ${singleRes.stderr}`);
            totalFailed++;
          }
        }
      }
    }
  }

  triggerServerSync();

  console.log(`\n====================================================`);
  console.log(`🎉 DEPLOY FINALIZADO: ${totalSent} arquivos enviados, ${totalFailed} falhas.`);
  console.log(`====================================================`);

  if (totalFailed > 0) {
    process.exit(1);
  }
}

deploy();

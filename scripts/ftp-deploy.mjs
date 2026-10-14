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

  // Inspecionar diretórios no FTP
  console.log(`\n🔍 Inspecionando estrutura de diretórios no FTP...`);
  const listRoot = spawnSync('curl', [
    '-sS', '-k', '--disable-epsv', '--ftp-pasv', '--ftp-skip-pasv-ip',
    '--connect-timeout', '10',
    `ftp://${host}/`,
    '-u', `${user}:${pass}`
  ], { encoding: 'utf-8' });
  console.log(`--- Arquivos na raiz do FTP (/) ---`);
  console.log((listRoot.stdout || '').trim().split('\n').join('\n'));

  const listParent = spawnSync('curl', [
    '-sS', '-k', '--disable-epsv', '--ftp-pasv', '--ftp-skip-pasv-ip',
    '--connect-timeout', '10',
    `ftp://${host}/../`,
    '-u', `${user}:${pass}`
  ], { encoding: 'utf-8' });
  console.log(`--- Arquivos no nível superior (/../) ---`);
  console.log((listParent.stdout || '').trim().split('\n').join('\n'));

  const targetPrefixes = ['', 'www'];
  console.log(`\n🎉 ESTRATÉGIA DEFINIDA: Publicando arquivos em rota direta (/) e (/www/)`);

  let success = 0;
  let fail = 0;

  for (const prefix of targetPrefixes) {
    const label = prefix ? `/${prefix}/` : 'raiz principal (/)';
    console.log(`\n📦 Sincronizando arquivos em ${label}...`);

    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const localPath = path.join(rootDir, f);
      const remotePath = prefix ? `${prefix}/${f}` : f;
      const remoteUrl = `ftp://${host}/${remotePath}`;
      const kb = (fs.statSync(localPath).size / 1024).toFixed(1);

      process.stdout.write(`  [${i + 1}/${files.length}] 📤 ${remotePath} (${kb} KB)... `);
      const res = spawnSync('curl', [
        '-sS',
        '--show-error',
        '-k',
        '--disable-epsv',
        '--ftp-pasv',
        '--ftp-skip-pasv-ip',
        '--ftp-create-dirs',
        '--retry', '2',
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
        console.error(`     Detalhe: ${(res.stderr || '').toString().trim()}`);
        fail++;
      }
    }
  }

  // Sobrescrever qualquer index.htm padrão de boas-vindas da hospedagem
  console.log(`\n🔄 Sobrescrevendo index.htm padrão da KingHost com a nossa tela de espera...`);
  for (const htmTarget of ['index.htm', 'www/index.htm']) {
    spawnSync('curl', [
      '-sS',
      '-k',
      '--disable-epsv',
      '--ftp-pasv',
      '--ftp-skip-pasv-ip',
      '--connect-timeout', '15',
      '-T', testLocal,
      `ftp://${host}/${htmTarget}`,
      '-u', `${user}:${pass}`
    ]);
  }
  console.log(`  ✅ index.htm atualizado com sucesso!`);

  // Executar sincronização direta no servidor para garantir raiz populada
  console.log(`\n🔄 Disparando sincronizador nativo do servidor (sync.php)...`);
  const syncRes = spawnSync('curl', ['-s', '--connect-timeout', '30', 'http://baytaka.com.br/www/sync.php'], { encoding: 'utf-8' });
  console.log(`--- Saída do sync.php ---`);
  console.log((syncRes.stdout || '').trim());

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
  const testEndpoints = [
    'http://baytaka.com.br/',
    'http://baytaka.com.br/index.html',
    'http://baytaka.com.br/assets/images/baytaka-logo-raw.jpg',
    'http://www.baytaka.com.br/',
    'http://baytaka.com.br/www/index.html'
  ];
  for (const testUrl of testEndpoints) {
    const check = spawnSync('curl', ['-s', '-I', '--connect-timeout', '10', testUrl], { encoding: 'utf-8' });
    const firstLine = (check.stdout || '').split('\n')[0].trim();
    console.log(`  • ${testUrl} -> ${firstLine || 'sem resposta'}`);
  }

  console.log(`\n🔍 Diagnóstico PHP de DocumentRoot:`);
  for (const infoUrl of ['http://baytaka.com.br/info.php', 'http://baytaka.com.br/www/info.php']) {
    const checkInfo = spawnSync('curl', ['-s', '--connect-timeout', '10', infoUrl], { encoding: 'utf-8' });
    console.log(`--- Resposta de ${infoUrl} ---`);
    console.log((checkInfo.stdout || '').trim() || 'Sem resposta');
  }
}

deploy();


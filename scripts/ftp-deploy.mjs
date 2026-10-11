import { spawnSync } from 'child_process';

function deploy() {
  const host = (process.env.FTP || process.env.FTP_SERVER || 'web15f18.uni5.net').replace(/^ftp:\/\//, '').replace(/\/$/, '').trim();
  const user = (process.env.USER || process.env.FTP_USERNAME || '').trim();
  const pass = (process.env.SENHA || process.env.FTP_PASSWORD || '').trim();

  console.log(`🔐 Inspecionando permissões do servidor Locaweb (${host}) para ${user}...`);

  const res = spawnSync('curl', [
    '-v',
    '-sS',
    '--show-error',
    '-k',
    '--disable-epsv',
    '--ftp-pasv',
    '--ftp-skip-pasv-ip',
    '--connect-timeout', '20',
    `ftp://${host}/`,
    '-u', `${user}:${pass}`
  ], { encoding: 'utf-8' });

  console.log('--- Resposta stdout: ---');
  console.log(res.stdout);
  console.log('--- Resposta stderr / logs: ---');
  console.log(res.stderr);
}

deploy();

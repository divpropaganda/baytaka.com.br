import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

function listRemote(host, user, pass, useSsl = true) {
  const args = [
    '-sS',
    '--show-error',
    '-k',
    '--disable-epsv',
    '--ftp-pasv',
    '--ftp-skip-pasv-ip',
    '--connect-timeout', '15'
  ];
  if (useSsl) args.push('--ssl');
  args.push('-l', `ftp://${host}/`, '-u', `${user}:${pass}`);

  const res = spawnSync('curl', args, { encoding: 'utf-8' });
  return { status: res.status, output: res.stdout || res.stderr };
}

function deploy() {
  const host = (process.env.FTP || process.env.FTP_SERVER || 'web15f18.uni5.net').replace(/^ftp:\/\//, '').replace(/\/$/, '').trim();
  const user = (process.env.USER || process.env.FTP_USERNAME || '').trim();
  const pass = (process.env.SENHA || process.env.FTP_PASSWORD || '').trim();

  console.log(`🔐 Testando listagem remota com usuário ${user} em ${host}...`);

  const listSsl = listRemote(host, user, pass, true);
  console.log(`📂 Listagem remota (SSL=true, status=${listSsl.status}):\n${listSsl.output}`);

  const listPlain = listRemote(host, user, pass, false);
  console.log(`📂 Listagem remota (SSL=false, status=${listPlain.status}):\n${listPlain.output}`);

  // Testar também no host alternativo se diferente
  if (host !== 'web15f18.uni5.net') {
    const listAlt = listRemote('web15f18.uni5.net', user, pass, true);
    console.log(`📂 Listagem remota no host alternativo web15f18.uni5.net:\n${listAlt.output}`);
  }
}

deploy();

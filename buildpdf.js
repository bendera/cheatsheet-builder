/* eslint-disable no-console, no-restricted-syntax */
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const rimraf = require('rimraf');

async function buildPdf(params) {
  const { slug, orientation } = params;

  const paramList = [
    'wkhtmltopdf',
    '--log-level warn',
    `--orientation ${orientation}`,
    '--disable-smart-shrinking',
    '--zoom 1',
    '-T 10mm',
    '-R 10mm',
    '-B 10mm',
    '-L 10mm',
    `dist/cheatsheets/${slug}/index.html`,
    `dist/pdf/${slug}.pdf`,
  ];

  try {
    await exec(paramList.join(' '));
  } catch (e) {
    console.log('wkhtml error');
    console.log('cmd:', e.cmd.trim());
    console.log(e.stderr.trim());
    process.exit(1);
  }

  console.log(`[wkhtmltopdf] dist/pdf/${slug}.pdf created`);
}

async function buildAll(buildParams) {
  let res;

  try {
    res = await exec('wkhtmltopdf --version');
  } catch (e) {
    console.log(e.stderr);
    process.exit(1);
  }

  if (!(/0.12.5/.test(res.stdout) && /qt/.test(res.stdout))) {
    console.log('WARN: Your wkhtmltopdf version is:', res.stdout.trim());
    console.log('WARN: Preferred: wkhtmltopdf 0.12.5 (with patched qt)');
  }

  for (const item of buildParams) {
    buildPdf(item);
  }
}

fs.readFile('dist/buildparams.json', 'utf8', (err, data) => {
  if (err) throw err;

  rimraf('dist/pdf', () => {
    fs.mkdir('dist/pdf', { recursive: true }, (e) => {
      if (e) throw e;
      buildAll(JSON.parse(data));
    });
  });
});

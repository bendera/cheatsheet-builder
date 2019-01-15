/* eslint-disable no-console, no-restricted-syntax */

const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function buildPdf(slug) {
  try {
    await exec(`wkhtmltopdf --log-level warn --disable-smart-shrinking dist/cheatsheets/${slug}/index.html dist/pdf/${slug}.pdf`);
  } catch (e) {
    throw e;
  }

  console.log(slug);
}

async function buildAll(slugs) {
  let res;

  try {
    res = await exec('wkhtmltopdf --version');
  } catch (e) {
    throw e;
  }

  if (!(/0.12.5/.test(res.stdout) && /qt/.test(res.stdout))) {
    console.log('WARN: wkhtml version', res.stdout);
    return;
  }

  for (const slug of slugs) {
    buildPdf(slug);
  }
}

buildAll(['git', 'tmux', 'vim']);

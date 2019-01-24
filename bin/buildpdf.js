/* eslint-disable no-console, no-restricted-syntax */
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const rimraf = require('rimraf');

function buildPdf(params) {
  return new Promise((resolve, reject) => {
    const { slug, orientation } = params;

    const paramList = [
      'docker run -v $(pwd)/dist:/dist/ wkhtmltox',
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

    exec(paramList.join(' '))
      .then(() => {
        resolve(`${slug}.pdf created`);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function* buildQueue(buildParams) {
  for (const item of buildParams) {
    yield buildPdf(item);
  }
}

/* async function buildAll(buildParams) {
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
    buildPdf(item)
      .then(() => {
        process.exit();
      })
      .catch(() => {
        process.exit();
      });
  }
} */

fs.readFile('dist/buildparams.json', 'utf8', (err, data) => {
  if (err) throw err;

  rimraf('dist/pdf', () => {
    fs.mkdir('dist/pdf', { recursive: true }, (e) => {
      if (e) throw e;

      const buildParams = JSON.parse(data);
      const queue = buildQueue(buildParams);
      let done = false;

      while (!done) {
        const actual = queue.next();

        done = actual.done;

        actual.value
          .then((out) => {
            console.log(out);
          })
          .catch((error) => {
            console.log(error);
          });
      }

      // buildAll(JSON.parse(data));
    });
  });
});

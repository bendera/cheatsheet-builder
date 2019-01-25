/* eslint-disable no-console, no-restricted-syntax */
const fs = require('fs');
const util = require('util');
const { exec } = require('child_process');
const rimraf = require('rimraf');
const path = require('path');

const execAsync = util.promisify(exec);
const pwd = path.resolve(__dirname, '../');

function buildPdf(params) {
  return new Promise((resolve, reject) => {
    const { slug, orientation } = params;
    const command = 'docker';
    const paramList = [
      'run', '-v', `${pwd}/dist:/dist/`,
      'wkhtmltox',
      '--log-level', 'info',
      '--orientation', `${orientation}`,
      '--disable-smart-shrinking',
      '--zoom', '1',
      '-T', '10mm',
      '-R', '10mm',
      '-B', '10mm',
      '-L', '10mm',
      `dist/cheatsheets/${slug}/index.html`,
      `dist/pdf/${slug}.pdf`,
    ];

    execAsync([command, ...paramList].join(' '))
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

fs.readFile('dist/buildparams.json', 'utf8', (err, data) => {
  if (err) throw err;

  rimraf('dist/pdf', () => {
    fs.mkdir('dist/pdf', { recursive: true }, (e) => {
      if (e) throw e;

      const buildParams = JSON.parse(data);
      const queue = buildQueue(buildParams);

      const step = (nextPromise) => {
        nextPromise.then((val) => {
          console.log(val);

          const np = queue.next();

          if (!np.done) {
            step(np.value);
          }
        });
      };

      step(queue.next().value);
    });
  });
});

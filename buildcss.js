const autoprefixer = require('autoprefixer');
const postcss = require('postcss');
const pcssImport = require('postcss-import');
const precss = require('precss');
const fs = require('fs');
const chokidar = require('chokidar');

const from = 'src/assets/styles/src/main.pcss';
const to = 'src/assets/styles/main.css';

const watch = process.argv.indexOf('--watch') > -1;

let started = false;

function buildCss() {
  fs.readFile(from, (err, css) => {
    postcss([
      pcssImport(),
      precss,
      autoprefixer({ browsers: 'last 2 version, chrome >= 13' }),
    ])
      .process(css, {
        from,
        to,
        map: { inline: false },
      })
      .then((result) => {
        fs.writeFile(to, result.css, () => true);
        if (result.map) {
          fs.writeFile(`${to}.map`, result.map, () => true);
        }

        // eslint-disable-next-line no-console
        console.log('[CSS builder] css compiled');
        started = true;
      })
      .catch((e) => {
        console.log(e);
      });
  });
}

if (watch) {
  const watcher = chokidar.watch('src/assets/styles/src/**/*');

  watcher.on('add', (path) => {
    if (!started) {
      return;
    }

    // eslint-disable-next-line no-console
    console.log(`[CSS builder] File ${path} has been added`);
    buildCss();
  });

  watcher.on('change', (path) => {
    // eslint-disable-next-line no-console
    console.log(`[CSS builder] File ${path} has been changed`);
    buildCss();
  });

  watcher.on('unlink', (path) => {
    // eslint-disable-next-line no-console
    console.log(`[CSS builder] File ${path} has been removed`);
    buildCss();
  });

  // eslint-disable-next-line no-console
  console.log('[CSS builder] Listening to css changes...');
}

buildCss();

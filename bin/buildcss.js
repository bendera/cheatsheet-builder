const chokidar = require('chokidar');
const fs = require('fs');
const postcss = require('postcss');
const postcssAutoprefixer = require('autoprefixer');
const postcssImport = require('postcss-import');
const postcssCssVariables = require('postcss-css-variables');
const postcssCssnano = require('cssnano');
const postcssNested = require('postcss-nested');
const postcssRem = require('postcss-rem');

const inputDir = 'src/styles/';
const outputDir = 'src/eleventy/assets/styles/';
const files = ['main.css', 'cheatsheets.css'];

const watch = process.argv.indexOf('--watch') > -1;

let started = false;

function buildCss(from, to) {
  fs.readFile(from, (err, css) => {
    if (err) {
      throw err;
    }

    postcss([
      postcssImport(),
      postcssCssVariables(),
      postcssNested(),
      postcssRem(),
      postcssAutoprefixer({ browsers: 'last 2 version, chrome >= 13' }),
      postcssCssnano(),
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
        console.log(`[CSS builder] File ${from} has been compiled`);
        started = true;
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.log(e);
      });
  });
}

function buildAll() {
  files.forEach((file) => {
    buildCss(inputDir + file, outputDir + file);
  });
}

if (watch) {
  const watcher = chokidar.watch('src/styles/**/*');

  watcher.on('add', (path) => {
    if (!started) {
      return;
    }

    // eslint-disable-next-line no-console
    console.log(`[CSS builder] File ${path} has been added`);
    buildAll();
  });

  watcher.on('change', (path) => {
    // eslint-disable-next-line no-console
    console.log(`[CSS builder] File ${path} has been changed`);
    buildAll();
  });

  watcher.on('unlink', (path) => {
    // eslint-disable-next-line no-console
    console.log(`[CSS builder] File ${path} has been removed`);
    buildAll();
  });

  // eslint-disable-next-line no-console
  console.log('[CSS builder] Listening to css changes...');
}

buildAll();

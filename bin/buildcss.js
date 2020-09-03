const chokidar = require('chokidar');
const fs = require('fs');
const postcss = require('postcss');
const postcssAutoprefixer = require('autoprefixer');
const postcssEasyImport = require('postcss-easy-import');
const postcssCssVariables = require('postcss-css-variables');
const postcssCssnano = require('cssnano');
const postcssNested = require('postcss-nested');
const postcssRem = require('postcss-rem');

const inputDir = 'src/styles/';
const outputDir = 'src/eleventy/assets/styles/';
const files = ['main.postcss', 'cheatsheets.postcss'];

const watch = process.argv.indexOf('--watch') > -1;

let started = false;

function buildCss(from, to) {
  fs.readFile(from, (err, css) => {
    if (err) {
      throw err;
    }

    postcss([
      postcssEasyImport({
        extensions: ['.postcss', '.css'],
      }),
      postcssCssVariables(),
      postcssNested(),
      postcssRem(),
      postcssAutoprefixer(),
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
          fs.writeFile(`${to}.map`, result.map.toString(), () => true);
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
    const outputFile = file.replace(/.postcss$/g, '.css');

    buildCss(inputDir + file, outputDir + outputFile);
  });
}

if (watch) {
  const watcher = chokidar.watch(['src/styles/**/*', 'src/eleventy/cheatsheets/*/*.postcss']);

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

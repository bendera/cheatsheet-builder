const autoprefixer = require('autoprefixer');
const postcss = require('postcss');
const precss = require('precss');
const fs = require('fs');

const from = 'src/_assets/styles/src/main.pcss';
const to = 'src/_assets/styles/main.css';

fs.readFile(from, (err, css) => {
  postcss([
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
    })
    .catch(() => { });
});

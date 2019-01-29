/* eslint-disable no-console */
const rimraf = require('rimraf');

const paths = [
  'dist',
  'src/eleventy/assets/styles/*.css',
  'src/eleventy/assets/styles/*.css.map',
];

paths.forEach((path) => {
  rimraf(path, (err) => {
    if (err) {
      console.log('[ERR]', err.toString());
    } else {
      console.log(`${path} removed`);
    }
  });
});

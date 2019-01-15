/* eslint-disable no-console */
const rimraf = require('rimraf');

let pattern = '+(';
pattern += 'dist/';
pattern += 'src/eleventy/assets/styles/*.css';
pattern += 'src/eleventy/assets/styles/*.css.map';
pattern += ')';

rimraf(pattern, () => {
  console.log('Clean completed');
});

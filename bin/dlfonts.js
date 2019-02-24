/* eslint-disable no-console, no-restricted-syntax, no-await-in-loop */
const ora = require('ora');
const fetch = require('node-fetch');
const fs = require('fs');
const { promisify } = require('util');
const { URL } = require('url');
const path = require('path');
const config = require('../config.js');

const writeFile = promisify(fs.writeFile);

const dockerFontsDir = path.resolve(__dirname, '../docker/fonts/');
const cssFontsDir = path.resolve(__dirname, '../src/eleventy/assets/fonts/');
const cssDir = path.resolve(__dirname, '../src/styles/includes/fonts/');
const requestedFonts = [];

process.argv.forEach((el, i) => {
  if (i > 1) {
    requestedFonts.push(el);
  }
});

// get key from https://developers.google.com/fonts/docs/developer_api
const API_KEY = config.GOOGLE_FONTS_API_KEY;
const GFONTS_API_URL = `https://www.googleapis.com/webfonts/v1/webfonts?sort=alpha&key=${API_KEY}`;

const variantMap = {
  100: { weight: 100, name: 'Thin', style: 'normal' },
  '100italic': { weight: 100, name: 'Thin Italic', style: 'italic' },
  200: { weight: 200, name: 'ExtraLight', style: 'normal' },
  '200italic': { weight: 200, name: 'ExtraLight Italic', style: 'italic' },
  300: { weight: 300, name: 'Light', style: 'normal' },
  '300italic': { weight: 300, name: 'Light Italic', style: 'italic' },
  regular: { weight: 400, name: 'Regular', style: 'normal' },
  italic: { weight: 400, name: 'Italic', style: 'italic' },
  500: { weight: 500, name: 'Medium', style: 'normal' },
  '500italic': { weight: 500, name: 'Medium Italic', style: 'italic' },
  600: { weight: 600, name: 'SemiBold', style: 'normal' },
  '600italic': { weight: 600, name: 'SemiBold Italic', style: 'italic' },
  700: { weight: 700, name: 'Bold', style: 'normal' },
  '700italic': { weight: 700, name: 'Bold Italic', style: 'italic' },
  800: { weight: 800, name: 'ExtraBold', style: 'normal' },
  '800italic': { weight: 800, name: 'ExtraBold Italic', style: 'italic' },
  900: { weight: 900, name: 'Black', style: 'normal' },
  '900italic': { weight: 900, name: 'Black Italic', style: 'italic' },
};

function pascalCase(words) {
  const parts = words.split(' ');
  let retval = '';

  parts.forEach((p) => {
    retval += p.charAt(0).toUpperCase() + p.substring(1);
  });

  return retval;
}

function searchFamilyIndex(items, value) {
  let startIndex = 0;
  let stopIndex = items.length - 1;
  let middle = Math.floor((stopIndex + startIndex) / 2);

  while (items[middle].family !== value && startIndex < stopIndex) {
    if (value < items[middle].family) {
      stopIndex = middle - 1;
    } else if (value > items[middle].family) {
      startIndex = middle + 1;
    }

    middle = Math.floor((stopIndex + startIndex) / 2);
  }

  return (items[middle].family !== value) ? -1 : middle;
}

const getFont = async (url) => {
  const u = new URL(url);
  const filename = path.basename(u.pathname);

  try {
    const response = await fetch(url);
    const data = await response.buffer();

    return {
      filename,
      data,
    };
  } catch (error) {
    throw error;
  }
};

const getCss = (params) => {
  const {
    familyName,
    localName,
    fileName,
    weight,
    style,
  } = params;

  return `
  @font-face {
    font-family: '${familyName}';
    src: local('${localName}'), url('../fonts/${fileName}') format('truetype');
    font-weight: ${weight};
    font-style: ${style};
  }
  `;
};

const getFamily = async (name, files) => {
  const variants = Object.keys(files);

  for (const variant of variants) {
    const { data } = await getFont(files[variant]);

    const friendlyBasename = `${pascalCase(name)}-${variantMap[variant].name.replace(/\s+/g, '')}`;
    const familyName = name;
    const fileName = `${friendlyBasename}.ttf`;
    const localName = `${name} ${variantMap[variant].name}`;
    const { weight, style } = variantMap[variant];

    const css = getCss({
      familyName,
      localName,
      fileName,
      weight,
      style,
    });

    await writeFile(`${cssFontsDir}/${friendlyBasename}.ttf`, data, { encoding: 'binary' });
    await writeFile(`${cssDir}/${friendlyBasename}.postcss`, css);
  }

  return true;
};

const getData = async (url) => {
  const spinner = ora('Loading font info').start();

  try {
    const response = await fetch(url);
    const json = await response.json();

    spinner.succeed('Font info loaded');
    spinner.start('Loading fonts');

    for (const f of requestedFonts) {
      const { family, files } = json.items[searchFamilyIndex(json.items, f)];

      await getFamily(family, files);
    }

    spinner.succeed('Fonts loaded');
  } catch (error) {
    spinner.fail(error);
  }
};

getData(GFONTS_API_URL);

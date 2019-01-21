/* eslint-disable no-console, no-restricted-syntax, no-await-in-loop */
const ora = require('ora');
const fetch = require('node-fetch');
const fs = require('fs');
const { promisify } = require('util');
const { URL } = require('url');
const path = require('path');
const config = require('../config.js');

const writeFile = promisify(fs.writeFile);
const copyFile = promisify(fs.copyFile);

const dockerFonts = path.resolve(__dirname, '../docker/fonts/');
const cssFonts = path.resolve(__dirname, '../src/eleventy/assets/fonts/');
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
  '100italic': { weight: 100, name: 'ThinItalic', style: 'italic' },
  200: { weight: 200, name: 'ExtraLight', style: 'normal' },
  '200italic': { weight: 200, name: 'ExtraLightItalic', style: 'italic' },
  300: { weight: 300, name: 'Light', style: 'normal' },
  '300italic': { weight: 300, name: 'LightItalic', style: 'italic' },
  regular: { weight: 400, name: 'Regular', style: 'normal' },
  italic: { weight: 400, name: 'Italic', style: 'italic' },
  500: { weight: 500, name: 'Medium', style: 'normal' },
  '500italic': { weight: 500, name: 'MediumItalic', style: 'italic' },
  600: { weight: 600, name: 'SemiBold', style: 'normal' },
  '600italic': { weight: 600, name: 'SemiBoldItalic', style: 'italic' },
  700: { weight: 700, name: 'Bold', style: 'normal' },
  '700italic': { weight: 700, name: 'BoldItalic', style: 'italic' },
  800: { weight: 800, name: 'ExtraBold', style: 'normal' },
  '800italic': { weight: 800, name: 'ExtraBoldItalic', style: 'italic' },
  900: { weight: 900, name: 'Black', style: 'normal' },
  '9900italic': { weight: 900, name: 'BlackItalic', style: 'italic' },
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
  const spinner = ora('Loading font').start();
  const u = new URL(url);
  const filename = path.basename(u.pathname);

  try {
    const response = await fetch(url);
    const data = await response.buffer();

    spinner.succeed(`${filename} loaded`);

    return {
      filename,
      data,
    };
  } catch (error) {
    spinner.fail(error);
    throw error;
  }
};

const getFamily = async (name, files) => {
  // console.dir(familyMeta);
  const variants = Object.keys(files);

  for (const variant of variants) {
    // console.log(variant);
    const { filename, data } = await getFont(files[variant]);

    const friendlyFn = `${pascalCase(name)}-${variantMap[variant].name}.ttf`;

    console.log(friendlyFn);
    console.log(`${dockerFonts}/${friendlyFn}`);
    console.log(`${cssFonts}/${friendlyFn}`);

    await writeFile(`${dockerFonts}/${friendlyFn}`, data, { encoding: 'binary' });
    await copyFile(`${cssFonts}/${friendlyFn}`, `${dockerFonts}/${friendlyFn}`);
  }

  return true;
};

const getData = async (url) => {
  const spinner = ora('Loading font info').start();

  try {
    const response = await fetch(url);
    const json = await response.json();

    spinner.succeed('Font info loaded');

    /*
    const { filename, data } = await getFont(json.items[0].files.regular);

    const anyad = await writeFile(filename, data, { encoding: 'binary' });
    */

    for (const f of requestedFonts) {
      const { family, files } = json.items[searchFamilyIndex(json.items, f)];

      const ret = await getFamily(family, files);

      // console.log(ret);
    }

    /* if (error) {
      spinner.fail(error);
    } */
  } catch (error) {
    spinner.fail(error);
  }
};

getData(GFONTS_API_URL);

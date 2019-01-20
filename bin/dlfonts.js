/* eslint-disable no-console, no-restricted-syntax */
const ora = require('ora');
const fetch = require('node-fetch');
const fs = require('fs');
const { promisify } = require('util');
const { URL } = require('url');
const path = require('path');
const config = require('../config.js');

const writeFile = promisify(fs.writeFile);

const requestedFonts = [];

process.argv.forEach((el, i) => {
  if (i > 1) {
    requestedFonts.push(el);
  }
});

// get key from https://developers.google.com/fonts/docs/developer_api
const API_KEY = config.GOOGLE_FONTS_API_KEY;
const GFONTS_API_URL = `https://www.googleapis.com/webfonts/v1/webfonts?sort=alpha&key=${API_KEY}`;

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
  }
};

const getFamily = async (data) => {
  console.log(data);

  return 'aaa';
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

    for (const family of requestedFonts) {
      const familyMeta = json.items[searchFamilyIndex(json.items, family)];

      const ret = await getFamily(familyMeta);

      console.log(ret);
    }

    /* if (error) {
      spinner.fail(error);
    } */
  } catch (error) {
    spinner.fail(error);
  }
};

getData(GFONTS_API_URL);

const shortcodes = require('./src/shortcodes');

module.exports = function(eleventyConfig) {
  eleventyConfig.addLayoutAlias('cheatsheet', 'layouts/cheatsheet.njk');
  eleventyConfig.addLayoutAlias('default', 'layouts/default.njk');

  const pairedShortcodes = Object.keys(shortcodes.paired);
  const singleShortcodes = Object.keys(shortcodes.single);

  pairedShortcodes.forEach((name) => {
    eleventyConfig.addPairedShortcode(name, shortcodes.paired[name]);
  });

  singleShortcodes.forEach((name) => {
    eleventyConfig.addShortcode(name, shortcodes.single[name]);
  });

  eleventyConfig.addPassthroughCopy('src/eleventy/assets/styles');
  eleventyConfig.addPassthroughCopy('src/eleventy/assets/fonts');

  eleventyConfig.addCollection('cheatsheets', function(collection) {
    const coll = collection.getFilteredByTag('cheatsheet');

    coll.sort((a, b) => {
      if (a.data.title < b.data.title) {
        return -1;
      } else if(a.data.title > b.data.title) {
        return 1;
      } else {
        return 0;
      }
    });

    return coll;
  });

  return {
    templateFormats:[
      'njk',
      'css',
    ],
    passthroughFileCopy: true,
    dir: {
      input: "src/eleventy",
      output: "dist"
    }
  };
};
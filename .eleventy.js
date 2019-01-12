const shortcodes = require('./shortcodes');

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

  eleventyConfig.addPassthroughCopy('src/assets/styles/main.css');

  return {
    templateFormats:[
      'njk',
      'css',
      'map',
    ],
    passthroughFileCopy: true,
    dir: {
      input: "src",
      output: "dist"
    }
  };
};
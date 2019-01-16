const shortcodes = require('./src/shortcodes');
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

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

  eleventyConfig.addPlugin(syntaxHighlight);

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
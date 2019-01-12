module.exports = function(eleventyConfig) {
  eleventyConfig.addLayoutAlias('cheatsheet', 'layouts/cheatsheet.njk');
  eleventyConfig.addLayoutAlias('default', 'layouts/default.njk');

  return {
    dir: {
      input: "src",
      output: "dist"
    }
  };
};
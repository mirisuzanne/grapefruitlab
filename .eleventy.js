const nav = require('@11ty/eleventy-navigation');
const yaml = require('js-yaml');

const page = require('./filters/page');
const image = require('./filters/image');

const md = require('markdown-it')({
  html: true,
  breaks: false,
  linkify: true,
  typographer: true,
}).disable('code');


module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(nav);

  eleventyConfig.addFilter('md', content => md.render(content));
  eleventyConfig.addFilter('mdi', content => md.renderInline(content));
  eleventyConfig.addFilter('getPage', page.getPage);
  eleventyConfig.addFilter('imgSrc', (src) =>
    images.image(src, null, null, null, true),
  );

  eleventyConfig.addWatchTarget('./content/sass/');
  eleventyConfig.addPassthroughCopy('./content/css');
  eleventyConfig.addPassthroughCopy('./content/fonts');
  eleventyConfig.addPassthroughCopy('./content/favicon.svg');

  // shortcodes
  eleventyConfig.addNunjucksShortcode('image', image.image);
  eleventyConfig.addPairedShortcode('md', content => md.render(content));
  eleventyConfig.addPairedShortcode('mdi', content => md.renderInline(content));

  // collections
  eleventyConfig.addCollection('features', (collection) =>
    collection
      .getFilteredByTag('show')
      .filter((item) => item.data.feature)
      .sort((a, b) => a.date - b.date),
  );

  // config
  eleventyConfig.setLibrary('md', md);
  eleventyConfig.addDataExtension('yaml', yaml.load);
  eleventyConfig.setQuietMode(true);
  eleventyConfig.setDataDeepMerge(true);

  // settings
  return {
    markdownTemplateEngine: 'njk',
    dir: {
      input: 'content',
      includes: '_includes',
      layouts: '_layouts',
    },
  };
};

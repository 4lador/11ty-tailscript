const postcss = require("postcss");
const postcssImport = require("postcss-import");
const postcssMediaMinmax = require("postcss-media-minmax");
const autoprefixer = require("autoprefixer");
const postcssCsso = require("postcss-csso");
const sass = require("sass");
const esbuild = require('esbuild');
const tailwindcss = require('tailwindcss');
const nesting = require('tailwindcss/nesting');
const pluginWebc = require('@11ty/eleventy-plugin-webc');

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
module.exports = (eleventyConfig) => {
  eleventyConfig.addShortcode("year", () => {
    return `${new Date().getFullYear()}`;
  });

  eleventyConfig.setBrowserSyncConfig({
    files: "./dist/styles/**/*.css",
  });

  eleventyConfig.setBrowserSyncConfig({
    files: "./dist/scripts/**/*.js",
  });

  eleventyConfig.addPlugin(pluginWebc);

  eleventyConfig.addWatchTarget("./src/styles/");

  eleventyConfig.addPassthroughCopy("src/assets");

  eleventyConfig.addTemplateFormats("css");
  eleventyConfig.addExtension("css", {
    outputFileExtension: "css",

    compile: async (content, path) => {
      console.log('path', path);
      if (path !== "./src/styles/index.css") {
        return;
      }

      return async () => {
        let output = await postcss([
          postcssImport,
          nesting,
          tailwindcss,
          postcssMediaMinmax,
          autoprefixer,
          postcssCsso,
        ]).process(content, { from: path });

        return output.css;
      };
    },
  });

  eleventyConfig.addTemplateFormats("js");
  eleventyConfig.addExtension("js", {
    outputFileExtension: "js",

    compile: async (content, path) => {
      if (path !== "./src/scripts/index.js") {
        return;
      }

      return async () => {
        let output = await esbuild.build({
          target: 'es2020',
          entryPoints: [path],
          minify: true,
          bundle: true,
          write: false
        });

        return output.outputFiles[0].text;
      };
    },
  });

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
    },
  };
};

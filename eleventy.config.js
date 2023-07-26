const postcss = require("postcss");
const postcssImport = require("postcss-import");
const postcssMediaMinmax = require("postcss-media-minmax");
const autoprefixer = require("autoprefixer");
const postcssCsso = require("postcss-csso");
const esbuild = require('esbuild');
const tailwindcss = require('tailwindcss');
const nesting = require('tailwindcss/nesting');
const pluginWebc = require('@11ty/eleventy-plugin-webc');
const bundlerPlugin = require("@11ty/eleventy-plugin-bundle");

const postcssPipeline = [
  postcssImport,
  nesting,
  tailwindcss,
  postcssMediaMinmax,
  autoprefixer,
  postcssCsso,
];

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

  eleventyConfig.addPlugin(pluginWebc, {
    components: "src/_includes/components/**/*.webc"
  });

  eleventyConfig.addPlugin(bundlerPlugin, {
    transforms: [
      async function (content) {
        if (this.type === 'css') {
          let output = await postcss(postcssPipeline).process(content, { from: this.page.inputPath, to: null });

          return output.css;
        }

        return content;
      }
    ]
  });

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
        let output = await postcss(postcssPipeline).process(content, { from: path });

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

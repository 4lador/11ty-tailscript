const postcss = require("postcss");
const postcssImport = require("postcss-import");
const postcssMediaMinmax = require("postcss-media-minmax");
const autoprefixer = require("autoprefixer");
const postcssCsso = require("postcss-csso");
const esbuild = require('esbuild');
const tailwindcss = require('tailwindcss');
const nesting = require('tailwindcss/nesting');
const pluginWebc = require('@11ty/eleventy-plugin-webc');
const purgecss = require('@fullhuman/postcss-purgecss');
const bundlerPlugin = require("@11ty/eleventy-plugin-bundle");
const { mkdir, access, writeFile, readFile } = require('node:fs/promises');
const path = require('path');
const eleventyVitePlugin = require('@11ty/eleventy-plugin-vite');
const dirConfig = require('./eleventy.dirs.config.js').dir;

const postcssPlugins = [
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
          let output = await postcss(postcssPlugins).process(content, { from: this.page.inputPath, to: null });

          return output.css;
        }

        return content;
      }
    ]
  });

  eleventyConfig.addWatchTarget("./src/styles/");
  eleventyConfig.addWatchTarget("./src/_includes/components/**/*.css");
  eleventyConfig.addWatchTarget("./src/_includes/components/**/*.js");

  eleventyConfig.addPassthroughCopy("src/assets");

  eleventyConfig.addTemplateFormats('webc');
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

  eleventyConfig.addExtension("css", {
    outputFileExtension: "css",

    compile: async (content, path) => {
      if (path !== "./src/styles/index.css") {
        return;
      }

      return async () => {
        let output = await postcss(postcssPlugins).process(content, { from: path });

        return output.css;
      };
    },
  });

  eleventyConfig.on('eleventy.before', async () => await makeFolderIfNeeded('./dist/styles'));
  eleventyConfig.on('eleventy.after', async () => await postCssProcessing(postcssPlugins));

  
  eleventyConfig.addPlugin(eleventyVitePlugin, {
    tempFolderName: '.11ty-vite',

    /** @type {import('vite').UserConfig} */
    viteOptions: {
      css: {
        postcss: {
          plugins: postcssPlugins
        }
      },
      server: {
        mode: 'development',
        middlewareMode: true
      },
      resolve: {
        alias: {
          '/node_modules': path.resolve('.', 'node_modules')
        }
      }
    }
  });

  async function postCssProcessing(plugins) {
    console.log('post processing css');

    const srcDir = './src/styles';
    const destDir = './dist/styles';

    const cssOperations = [
      {
        source: `${srcDir}/index.css`,
        destination: `${destDir}/index.css`,
        plugins: postcssPlugins
      },
      {
        source: `${srcDir}/fonts.css`,
        destination: `${destDir}/fonts.css`,
        plugins: [...postcssPlugins, purgecss({content: ['./dist/**/*.html']})]
      }
    ];
    
    await makeFolderIfNeeded('./dist/styles');

    for (const operation of cssOperations) {
      console.log('Reading css file: ' + operation.source);

      const css = await readFile(operation.source);

      postcss(operation.plugins)
        .process(css, { from: operation.source, to: null })
        .then(async (result) => {
          console.log('Writing css of length ' + result.css.length);
          console.log('Writing CSS file to ' + operation.destination);
          await writeFile(operation.destination, result.css, () => true)
        })
        .catch((error) => { throw new Error(error) });
    }
    
  }

  async function makeFolderIfNeeded(dir) {
    const outputDir = dir;
    const exists = async (path) => {
      try {
        await access(path);
        return true;
      } catch (error) {
        return false;
      }
    };

    let dirExists = await exists(outputDir);
    console.log('dirExists: ' + dirExists);

    if (!dirExists) {
      console.log('Creating missing CSS folder: ' + outputDir);

      try {
        await mkdir(outputDir, { recursive: true });
        dirExists = await exists(outputDir);
        console.log('dirExists: ' + dirExists);
      } catch (error) {
        console.error(error);
      }
    }
  }

  return {
    dir: dirConfig,
  };
};

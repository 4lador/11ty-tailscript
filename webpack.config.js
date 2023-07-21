const glob = require('glob');
const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  plugins: [new MiniCssExtractPlugin()],
  entry: glob.sync(`${__dirname}/src/**/*.ts*`).reduce((result, file) => {
    let [name] = file.split('src/').slice(-1);

    result[name.replace(/\.tsx?$/g, '')] = file;

    return result;
  }, {}),
  output: {
    path: path.join(__dirname, '/src/_js'),
    filename: '[name].js',
    libraryTarget: 'umd',
  },
  context: path.join(__dirname, '/src/'),
  cache: true,
  target: 'node',
  externals: fs.readdirSync('node_modules'),
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
      {
        test: /\.s?css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  "postcss-preset-env",
                  {
                    //Options
                  }
                ]
              }
            }
          },
          'sass-loader',
          "style-loader"
        ]
      }
    ]
  }
};
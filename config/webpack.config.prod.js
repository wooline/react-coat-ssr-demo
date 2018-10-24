const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const PostcssFlexbugsFixes = require('postcss-flexbugs-fixes');
const PostcssPresetEnv = require('postcss-preset-env');
const paths = require('./paths');

const tsCompilerOptions = require(path.join(paths.rootPath, './tsconfig.json')).compilerOptions;
tsCompilerOptions.target = 'es2017';

const getStyleLoaders = (cssOptions, preProcessor) => {
  const loaders = [
    require.resolve('style-loader'),
    {
      loader: require.resolve('css-loader'),
      options: cssOptions,
    },
    {
      // Options for PostCSS as we reference these options twice
      // Adds vendor prefixing based on your specified browser support in
      // package.json
      loader: require.resolve('postcss-loader'),
      options: {
        // Necessary for external CSS imports to work
        // https://github.com/facebook/create-react-app/issues/2677
        ident: 'postcss',
        plugins: () => [
          PostcssFlexbugsFixes,
          PostcssPresetEnv({
            autoprefixer: {
              flexbox: 'no-2009',
            },
            stage: 3,
          }),
        ],
      },
    },
  ];
  if (preProcessor) {
    loaders.push(require.resolve(preProcessor));
  }
  return loaders;
};

const clientConfig = {
  mode: 'production',
  target: 'web',
  bail: true,
  devtool: false,
  entry: [path.join(paths.srcPath, './client')],
  output: {
    path: paths.distClientPath,
    filename: 'js/[name].[chunkhash:8].js',
    chunkFilename: 'js/[name].[chunkhash:8].chunk.js',
    publicPath: paths.sitePath,
    // Point sourcemap entries to original disk location (format as URL on Windows)
    devtoolModuleFilenameTemplate: info => path.relative(paths.srcPath, info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    modules: [paths.srcPath, 'node_modules'],
    plugins: [
      // Prevents users from importing files from outside of src/ (or node_modules/).
      // This often causes confusion because we only process files within src/ with babel.
      // To fix this, we prevent you from importing files out of src/ -- if you'd like to,
      // please link the files into your node_modules/ and let module-resolution kick in.
      // Make sure your source files are compiled, as they will not be processed in any way.
      // new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
      // new TsconfigPathsPlugin({ configFile: paths.appTsProdConfig }),
    ],
  },
  optimization: {
    minimize: false,
    splitChunks: {
      chunks: 'async',
    },
    // namedModules,namedChunks: false,, //在编译后的代码中用自增的数字代替module路径
    runtimeChunk: 'single',
  },
  performance: {
    maxEntrypointSize: 1000000,
    maxAssetSize: 1000000,
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.(ts|tsx)$/,
        include: paths.srcPath,
        loader: require.resolve('ts-loader'),
        options: {
          transpileOnly: true,
        },
      },
      {
        test: /\.css$/,
        use: getStyleLoaders({
          importLoaders: 1,
        }),
      },
      {
        test: /\.less$/,
        use: getStyleLoaders({ importLoaders: 2 }, 'less-loader'),
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        include: paths.srcPath,
        loader: require.resolve('url-loader'),
        query: {
          name: 'media/[name].[hash:8].[ext]',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(paths.publicPath, './server/tpl.html'),
    }),
    new ManifestPlugin({
      fileName: 'asset-manifest.json',
      publicPath: paths.sitePath,
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.ProgressPlugin(),
  ],
};

const serverConfig = {
  mode: 'production',
  target: 'node',
  bail: true,
  devtool: false,
  entry: [path.join(paths.srcPath, './server')],
  output: {
    libraryTarget: 'commonjs2',
    path: paths.distServerPath,
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    publicPath: paths.sitePath,
    // Point sourcemap entries to original disk location (format as URL on Windows)
    devtoolModuleFilenameTemplate: info => path.relative(paths.srcPath, info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    modules: [paths.srcPath, 'node_modules'],
    plugins: [
      // Prevents users from importing files from outside of src/ (or node_modules/).
      // This often causes confusion because we only process files within src/ with babel.
      // To fix this, we prevent you from importing files out of src/ -- if you'd like to,
      // please link the files into your node_modules/ and let module-resolution kick in.
      // Make sure your source files are compiled, as they will not be processed in any way.
      // new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
      // new TsconfigPathsPlugin({ configFile: paths.appTsProdConfig }),
    ],
  },
  optimization: {
    minimize: false,
    splitChunks: {
      chunks: 'async',
      cacheGroups: {
        vendor: {
          chunks: 'async',
          name: 'vendor',
          enforce: true,
        },
      },
    },
    // namedModules,namedChunks: false,, //在编译后的代码中用自增的数字代替module路径
    runtimeChunk: false,
  },
  performance: {
    maxEntrypointSize: 1000000,
    maxAssetSize: 1000000,
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.(ts|tsx)$/,
        include: paths.srcPath,
        loader: require.resolve('ts-loader'),
        options: {
          compilerOptions: tsCompilerOptions,
          transpileOnly: true,
        },
      },
    ],
  },
  plugins: [new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/), new webpack.ProgressPlugin()],
};
module.exports = [clientConfig, serverConfig];

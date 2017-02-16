/**
 * Refference
 * setup - http://geta6.hatenablog.com/entry/2016/04/05/165201
 * webpack configuration - http://yokotakenji.me/log/programming/js/webpack/4315/
 * plugins - http://thujikun.github.io/blog/2014/12/07/webpack/
 * webpack-dev-server - http://dackdive.hateblo.jp/entry/2016/05/07/183335
 * autoprefixer - https://github.com/ai/browserslist
 */

/**
 * import plugin
 */
// webpack & babel
import 'babel-polyfill';
import path from 'path';
import webpack from 'webpack';
import AssetsPlugin from 'assets-webpack-plugin';

// postcss
import precss from 'precss';
import cssnext from 'postcss-cssnext';
import cssImport from 'postcss-import';
import cssVars from 'postcss-nested-vars';
import cssNested from 'postcss-nested';
import cssMixins from 'postcss-sassy-mixins';
import cssComment from 'postcss-comment';
import autoprefixer from 'autoprefixer';

// else
import ExtractTextPlugin from 'extract-text-webpack-plugin';

/**
 * enviroments config
 */
const DEV = process.argv.includes('--development') || (process.env.NODE_ENV === 'development');
const DEBUG = process.argv.includes('--debug');
console.log(
  '[Enviroment]: ' + (DEV ? 'development' : 'production' ),
  '[Debug]: ' + DEBUG
);

/**
 * path/file config
 */
const APP = 'app';
const ENTRY = {
  JS: {
    MAIN: 'main.js',
    STYLE: 'style.js'
  },
  CSS: {
    MAIN: 'main.pcss',
  }
};
const APP_DIR = __dirname + `/${APP}/`;
const ASSETS = DEV ? APP_DIR + 'assets_dev/' :  APP_DIR + 'assets/' ;
const FILE_FORMAT = DEV ? '[name]' : '[name]-[hash]';
const PATH = {
  // src
  SRC: {
    JS: ASSETS + 'src/js/',
    PCSS: ASSETS + 'src/pcss/'
  },
  // dist
  BUILD: {
    JS: ASSETS + 'build/js/',
    CSS: ASSETS + 'build/css/'
  },
  JS: ASSETS + 'js/',
  CSS: ASSETS + 'css/',
  IMG: ASSETS + 'img/'
};

/**
 * URI config
 */
const URI = {
  PROTOCOL: 'http',
  HOST: 'localhost',
  PORT: 1234,
};
const URI_ALL = `${URI.PROTOCOL}://${URI.HOST}:${URI.PORT}`

/**
 * webpack settings
 */
const HMR = [
  'webpack-dev-server/client?' + URI_ALL,
  'webpack/hot/only-dev-server'
];

const webpackCommon = {
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: [
          '/node_modules/'
        ],
        include: [
          path.resolve(PATH.SRC.JS)
        ],
        loader: 'babel'
      },
      {
        test: /\.pcss$/,
        include: [
          path.resolve(PATH.SRC.PCSS)
        ],
        loader: ExtractTextPlugin.extract(
          'style',
            'css',
            'postcss'
        )
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract(
          'style',
          'css',
          'postcss'
        )
      },
      // {
      //   test: /\.scss$/,
      //   loader: ExtractTextPlugin.extract(
      //     'style-loader',
      //     'css-loader',
      //     'postcss-loader',
      //   )
      // },
    ]
  },

  cache: DEV,
  debug: DEV,
  stats: {
    colors: true,
    progress: DEV,
    reasons: DEV,
    hash: DEBUG,
    version: DEBUG,
    timings: true,
    chunks: DEBUG,
    chunkModules: DEBUG,
    cached: false,
    cachedAssets: false,
  },

  plugins: [
    // inline usefull valiables
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || (DEV ? 'development' : 'production')),
      },
    }),
    // convert  inline to extra
    new ExtractTextPlugin(
      FILE_FORMAT + '.css',
    ),
    ...(DEV ?
        // dev only plugin
        [
          // don"t show errors on compling
          // new webpack.NoErrorsPlugin(),
        ] :
        // prod only plugin
        [
          // minify use frequently module ids
          new webpack.optimize.OccurenceOrderPlugin(),
          // remove overlap code
          new webpack.optimize.DedupePlugin(),
          // use uglify
          new webpack.optimize.UglifyJsPlugin({
            compress: {
              // safe minify for ie8
              screw_ie8: true,
              // remove comment and space
              warnings: DEBUG
            }
          }),
          // overlap codes to gather into one bundle
          new webpack.optimize.AggressiveMergingPlugin(),
          // file suffix to  add finger print
          new AssetsPlugin()
        ]
    ),
  ],

  // https://webpack.github.io/docs/configuration.html#devtool
  devtool: DEV ? 'source-map' : false,
};

const webpackConfig = [{
  entry: {
    main: [
      PATH.SRC.JS + ENTRY.JS.MAIN
    ]
  },

  output: {
    publicPath: '/',
    path: DEV ? PATH.BUILD.JS : PATH.JS,
    filename: FILE_FORMAT + '.js',
    sourcePrefix: '  ',
  },

  resolve: {
    extensions: ['', '.js'],
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: [
          '/node_modules/'
        ],
        include: [
          path.resolve(PATH.SRC.JS)
        ],
        loader: 'babel'
      },
  ]},

  ...webpackCommon,
},
{
  entry: {
    main: [
      PATH.SRC.PCSS + ENTRY.CSS.MAIN
    ]
  },

  output: {
    path: DEV ? PATH.BUILD.CSS : PATH.CSS,
    filename: FILE_FORMAT + '.css',
  },

  resolve: {
    extensions: ['', '.css'],
  },

  module: {
    loaders: [
      {
        test: /\.pcss$/,
        loader: ExtractTextPlugin.extract(
          'style-loader',
          'css-loader?importLoaders=1',
          'postcss-loader'
        )
      }
    ]
  },

  // postcss
  postcss: webpack => {
    return [
      cssImport({
        addDependencyTo: webpack
      }),
      cssMixins(),
      cssVars(),
      cssNested(),
      cssnext(),
      cssComment(),
      autoprefixer(),
    ]
  },

  ...webpackCommon,
}];

export default webpackConfig;

'use strict';

const { src, dest, start, series } = require('gulp');
const plugins = require('gulp-load-plugins')();

const log = require('fancy-log');
const buffer = require('vinyl-buffer');

const { readdirSync, statSync } = require('fs');
const { join, sep } = require('path');

const del = require('del');
const merge = require('merge-stream');
const { reload, init } = require('browser-sync');

var runsAsWatch = false;

const argv = require('yargs').options({
  'baseUrl': {
      demandOption: false,
      describe: 'baseurl for the gulp dev task',
      type: 'string'
    },
  'watchPort': {
      demandOption: false,
      default: '8080',
      describe: 'Port used for watch',
      type: 'int'
  }
}).argv;


// gulp-plumber error handler; won't break the watch-stream
var errorHandler = {
  errorHandler: function (err) {
    console.log(err.toString());
    this.emit('end');
  }
};

// Helper to get all subdirs of a dir
function getFolders(dir) {
  return readdirSync(dir)
    .filter(function(file) {
      return statSync(join(dir, file)).isDirectory();
    });
}

// Helper to get all file prefixes. Delimiter is the first _ (underscore).
function getFileGroups(dir) {
  var alreadyReturned = [];
  return readdirSync(dir)
    .map(function (file) {
      var prefix = file.split('_')[0];
      if ( alreadyReturned.indexOf(prefix) === -1) {
        alreadyReturned.push(prefix);
        return prefix;
      }
    });
}


function filterDesktop(file) {
  var tarr = file.path.split('/');
  var fname = tarr[tarr.length -1];
  return fname.indexOf('desktop') > -1;
}


function replaceBlessedCSSunRev(filename) {
  if (filename.search(/\.min-blessed\d\.css/) > -1) {
    return filename.replace('static/build/css/split/', '');
  }
  return filename;
}

function replaceBlessedCSSRev(filename) {
  if (filename.search(/\.min-blessed\d\.css/) > -1) {
      return filename.replace(/^http.*static\/build\/css\/split\//, '');
  }
  return filename;
}


// Build Styles
function styles(cb) {
  return src('static/sass/**/*.scss')
    .pipe(plugins.if(runsAsWatch,plugins.plumber(errorHandler)))
    .pipe(plugins.sass({
      outputStyle: 'expanded',
      sourceComments: true
    }))
    .pipe(plugins.autoprefixer({ cascade: false }))
    .pipe(dest('static/build/css'))
    .pipe(reload({ stream: true }))
    .pipe(plugins.cleanCss({ compatibility: 'ie9' }))
    .pipe(plugins.rename({ suffix: '.min' }))
    .pipe(dest('static/build/css'))
    .pipe(reload({ stream: true }))
    .pipe(plugins.if(filterDesktop, plugins.bless()))
    .pipe(plugins.if(filterDesktop, dest('static/build/css/split/')))
    .pipe(plugins.if(filterDesktop, reload({ stream: true })));
}


// Build JavaScript
function js(cb) {
  return src('static/js/*.js')
    .pipe(plugins.if(runsAsWatch,plugins.plumber(errorHandler)))
    .pipe(plugins.include())
    .pipe(dest('static/build/js'))
    .pipe(plugins.uglify())
    .pipe(plugins.rename({ suffix: '.min' }))
    .pipe(dest('static/build/js'))
    .pipe(reload({ stream: true }));
}


/* SVG Min & Map
 * Note: This creates a svgmap _for each directory_ in assets/svg.
 * Also it will add the directory name as a prefix for the svg symbol IDs
 * in order to ensure unique symbol IDs.
============================== */
function svg(cb) {

  var folders = getFolders('assets/svg');

  var tasks = folders.map(function (folder) {

    var name = "";

    return src('assets/svg/' + folder + '/*.svg', { base: 'assets/svg' })
    .pipe(plugins.plumber(errorHandler))
    .pipe(plugins.svgmin({
      plugins: [{
        js2svg: {
          pretty: true
        }
      }, {
        removeViewBox: false
      }, {
        removeDimensions: true
      }, {
        removeComments: true
      }]
    }))
    .pipe(dest('assets/build/svg'));

  });

  return merge(tasks);
}

/* Image Optimization
 ============================== */
function img(cb) {
  return src('assets/img/**')
    .pipe(plugins.changed('assets/img/**'))
    // required to turn file streams to buffers for imagemin
    .pipe(buffer())
    .pipe(dest('assets/build/img/'));
}

/* Watch
============================== */
function watch(cb) {
  log('Remember to start Picturator.');
  // Proxy server with browserSync
  init({
    open: false,
    proxy: 'localhost:' + argv.watchPort
  });
  runsAsWatch = true;
  plugins.watch('static/sass/**/*.scss', plugins.batch(function (events, done) {
    start('styles', done);
  }));
  plugins.watch('static/js/**/*.js', plugins.batch(function (events, done) {
    start('js', done);
  }));
  plugins.watch('**/*.xhtml').on('change', reload);
}
exports.watch = watch;

/* Rev (asset-pipeline)
============================== */

function revRename(cb) {
  return src(['static/build/{css,js}/**', 'assets/**/**', '!assets/{img,svg}/**', '!assets/build/svg/**', '!**/**.pdf'], {base: '.'})
    // move compressed images from build folder to basepath
    .pipe(plugins.rename(function(path) {
        path.dirname = path.dirname.replace('assets/build/img', 'assets/img');
      }))
    .pipe(plugins.rev())
    .pipe(dest("tmp"))
    .pipe(plugins.rev.manifest())
    .pipe(dest("tmp"));
}

function revReplace(cb) {
  var manifest = src("./tmp/rev-manifest.json");
  console.log('baseURL: ' + argv.baseUrl);

  return src(['{desktop,tablet,phone}/**/*.*', 'assets/build/svg/**', '**/**.pdf', 'tmp/**'], {base: '.'})
    .pipe(plugins.revReplace({
              manifest: manifest,
              prefix: '',
              modifyUnreved: replaceBlessedCSSunRev,
              modifyReved: replaceBlessedCSSRev,
              replaceInExtensions: ['.js', '.html', '.xhtml', '.css']
          }))
    .pipe(plugins.rename(function(path) {
          path.dirname = path.dirname.replace('tmp/', '');
        }))
    .pipe(dest("dist"));
}
exports.revReplace = revReplace;

function revClean (cb) {
  return del(["tmp/**", "dist/tmp/**"]);
}

/* Clean builded files
============================== */



function cleanCss(cb) {
  return del(['static/build/css/**/*.css']);
};

function cleanJs(cb) {
   return del(['static/build/js/*.js']);
}

function cleanDist(cb) {
  return del(['dist/**/*']);
}

function cleanImg(cb) {
  return del(['assets/build/img/**/*']);
}


function cleanSvg(cb) {
  return del(['assets/build/svg/*']);
}


exports.clean = series(cleanCss, cleanJs, cleanSvg, cleanImg)
exports.rev = series(cleanDist, revRename, revReplace, revClean)
exports.svg = series(cleanSvg, svg)
exports.js = series(cleanJs, js)

exports.styles = series(cleanCss, styles)
exports.default = series(cleanCss, cleanJs, cleanSvg, cleanImg, js, img, svg, styles)

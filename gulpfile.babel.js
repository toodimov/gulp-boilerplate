import gulp from "gulp";
import yargs from "yargs";
import sass from "gulp-sass";
import cleanCSS from "gulp-clean-css";
import htmlmin from "gulp-htmlmin";
import removeHtmlComments from "gulp-remove-html-comments";
import gulpif from "gulp-if";
import sourcemaps from "gulp-sourcemaps";
import browserSync from "browser-sync";
import imagemin from "gulp-imagemin";
import del from "del";
import webpack from "webpack-stream";
import uglify from "gulp-uglify";

const server = browserSync.create();

const PRODUCTION = yargs.argv.prod;

const paths = {
  html: {
    src: "src/**/*.html",
    dest: "dist/",
  },
  styles: {
    src: "src/assets/scss/bundle.scss",
    dest: "dist/assets/css",
  },
  images: {
    src: "src/assets/images/**/*.{jpg,jpeg,png}",
    dest: "dist/assets/images",
  },
  scripts: {
    src: "src/assets/js/bundle.js",
    dest: "dist/assets/js",
  },
  other: {
    src: ["src/assets/**/*", "!src/assets/{images,js,scss}/**/*"],
    dest: "dist/assets/",
  },
  package: {
    src: [
      "**/*",
      "!.vscode,",
      "!node_modules",
      "!node_modules{,/**}",
      "!packaged{,/**}",
      "!src{,/**}",
      "!.babelrc",
      "!.gitignore",
      "!gulpfile.babel.js",
      "!package.json",
      "!package-lock.json",
    ],
    dest: "packaged",
  },
};

export const reload = (done) => {
  server.reload();
  done();
};

// Clean Task / Delete Dist Folder
export const clean = () => del(["dist"]);

// Html
export const html = () => {
  return gulp
    .src(paths.html.src)
    .pipe(gulpif(PRODUCTION, removeHtmlComments()))
    .pipe(
      gulpif(
        PRODUCTION,
        htmlmin({
          collapseWhitespace: true,
          removeComments: true,
        })
      )
    )
    .pipe(gulp.dest(paths.html.dest))
    .pipe(server.stream());
};

// Style
export const styles = () => {
  return gulp
    .src(paths.styles.src)
    .pipe(gulpif(!PRODUCTION, sourcemaps.init()))
    .pipe(sass().on("error", sass.logError))
    .pipe(gulpif(PRODUCTION, cleanCSS({ compatibility: "ie8" })))
    .pipe(gulpif(!PRODUCTION, sourcemaps.write()))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(server.stream());
};

// Images
export const images = () => {
  return gulp
    .src(paths.images.src)
    .pipe(gulpif(PRODUCTION, imagemin()))
    .pipe(gulp.dest(paths.images.dest));
};

// Copy
export const copy = () => {
  return gulp.src(paths.other.src).pipe(gulp.dest(paths.other.dest));
};

// Scripts
export const scripts = () => {
  return gulp
    .src(paths.scripts.src)
    .pipe(
      webpack({
        module: {
          rules: [
            {
              test: /\.js$/,
              use: {
                loader: "babel-loader",
                options: {
                  presets: ["babel-preset-env"],
                },
              },
            },
          ],
        },
        output: {
          filename: "bundle.js",
        },
        externals: {
          jQuery: "jQuery",
        },
        devtool: !PRODUCTION ? "inline-source-map" : false,
        mode: PRODUCTION ? "production" : "development",
      })
    )
    .pipe(gulpif(PRODUCTION, uglify()))
    .pipe(gulp.dest(paths.scripts.dest));
};

// Compress Bundle
export const compress = () => {
  return gulp
    .src(paths.package.src)
    .pipe(replace("_themename", info.name))
    .pipe(zip(`${info.name}.zip`))
    .pipe(gulp.dest(paths.package.dest));
};

// Watch
export const watch = () => {
  server.init({
    server: {
      baseDir: paths.html.dest,
    },
  });
  gulp.watch("src/**/*.html", html);
  gulp.watch("src/assets/scss/**/*.scss", styles);
  gulp.watch("src/assets/js/main/*.js", gulp.series(scripts, reload));
  gulp.watch(paths.images.src, gulp.series(images, reload));
  gulp.watch(paths.other.src, gulp.series(copy, reload));
};

// Development
export const dev = gulp.series(
  clean,
  gulp.parallel(html, styles, scripts, images, copy),
  watch
);
// Build
export const build = gulp.series(
  clean,
  gulp.parallel(styles, scripts, images, copy)
);
// Build and Compress
export const bundle = gulp.series(build, compress);

// Default Dev Task
export default dev;

// const gulp = require('gulp');

// // CSS related plugins
// const sass = require('gulp-sass');
// const autoprefixer = require('autoprefixer');
// const cssnano = require('cssnano');
// const postcss = require('gulp-postcss');

// // JS related plugins
// const concat = require('gulp-concat');
// const babel = require('gulp-babel');
// const uglify = require('gulp-uglify');

// // Utility plugins
// const rename = require('gulp-rename');
// const sourcemaps = require('gulp-sourcemaps');

// // Browsers related plugins
// const browserSync = require('browser-sync').create();

// // File Path
// const paths = {
//     styles: {
//         src: 'src/scss/**/*.scss',
//         dest: 'dist/assets/css/'
//     },
//     scripts: {
//         src: 'src/js/**/*.js',
//         dest: 'dist/assets/js/'
//     }
// };

// // Sass task: compiles the style.scss file into style.css
// function style() {
//     return gulp.src(paths.styles.src)
//         .pipe(sourcemaps.init())
//         .pipe(sass().on('eror', sass.logError))
//         .pipe(postcss([autoprefixer(), cssnano()])) // PostCSS plugins
//         .pipe(sourcemaps.write('.'))
//         .pipe(rename({
//             basename: 'style',
//             suffix: '.min'
//         }))
//         .pipe(gulp.dest(paths.styles.dest))
//         .pipe(browserSync.stream());
// }

// // JS task: concatenates and uglifies JS files to script.js
// function scripts() {
//     return gulp.src([paths.scripts.src, '!' + 'vendor/js/jquery.min.js'])
//         .pipe(babel())
//         .pipe(uglify())
//         .pipe(concat('script.js'))
//         .pipe(uglify())
//         .pipe(gulp.dest(paths.scripts.dest)
//         );
// }

// // Watch Function
// function watch() {
//     browserSync.init({
//         server: {
//             baseDir: paths.html.dest
//         }
//     });
//     gulp.watch(paths.styles.src, style);
//     gulp.watch(paths.scripts.src, scripts).on('change', browserSync.reload);
//     gulp.watch('dist/*.html').on('change', browserSync.reload);
// }

// const build = gulp.series(style, scripts, watch);

// exports.style = style;
// exports.scripts = scripts;
// exports.watch = watch;
// exports.build = build;

// // Define default task that can be called by just running `gulp`
// exports.default = build;

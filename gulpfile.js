
const gulp = require('gulp');

// CSS related plugins
const sass = require('gulp-sass');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');

// JS related plugins
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

// Utility plugins
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');

// Browsers related plugins
const browserSync = require('browser-sync').create();


// File Path
const paths = {
    styles: {
        src: 'src/scss/**/*.scss',
        dest: 'dist/assets/css/'
    },
    scripts: {
        src: 'src/js/**/*.js',
        dest: 'dist/assets/js/'
    }
};


// Sass task: compiles the style.scss file into style.css
function style() {
    return gulp.src(paths.styles.src)
        .pipe(sourcemaps.init())
        .pipe(sass().on('eror', sass.logError))
        .pipe(postcss([autoprefixer(), cssnano()])) // PostCSS plugins
        .pipe(sourcemaps.write('.'))
        .pipe(rename({
            basename: 'style',
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.stream());
}

// JS task: concatenates and uglifies JS files to script.js
function scripts() {
    return gulp.src([paths.scripts.src, '!' + 'vendor/js/jquery.min.js'])
        .pipe(babel())
        .pipe(uglify())
        .pipe(concat('script.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.scripts.dest)
        );
}


// Watch Function 
function watch() {
    browserSync.init({
        server: {
            baseDir: paths.html.dest
        }
    });
    gulp.watch(paths.styles.src, style);
    gulp.watch(paths.scripts.src, scripts).on('change', browserSync.reload);
    gulp.watch('dist/*.html').on('change', browserSync.reload);
}


const build = gulp.series(style, scripts, watch);

exports.style = style;
exports.scripts = scripts;
exports.watch = watch;
exports.build = build;

// Define default task that can be called by just running `gulp`
exports.default = build;

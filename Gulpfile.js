/* eslint-env node */

const gulp = require('gulp');
const vulcanize = require('gulp-vulcanize');
const sass = require('gulp-sass');
const compiler = require('@af-modules/compiler');
const bundleTemplates = require('gulp-bundle-templates');
const rename = require('gulp-rename');

const cache = '.cache/';
const dist = 'dist';
const distWeb = `${dist}/web`;

gulp.task('sass', [], () => {
    return gulp.src(['src/styles/main.scss'])
        .pipe(sass().on('error', sass.logError))
        .pipe(rename('app.css'))
        .pipe(gulp.dest(cache));
});

gulp.task('copy:cache', [], () => {
    return gulp.src(['src/**/*.html'])
        .pipe(gulp.dest(cache));
});

gulp.task('compile', ['vulcanize'], () => {
    const compile = compiler({
        cacheDir: '.cache/',
        outDir: distWeb,
    });

    return gulp.src(['src/code/bootstrap.js'])
        .pipe(compile({
            module: 'app',
            context: 'src/code/',
        }));
});

gulp.task('bundle:templates', ['copy:cache'], () => {
    return gulp.src(['src/index.html'])
        .pipe(bundleTemplates())
        .pipe(gulp.dest('.cache/'));
});

gulp.task('vulcanize', ['copy:cache', 'sass', 'bundle:templates'], () => {
    return gulp.src(['.cache/index.html'])
        .pipe(vulcanize({
            excludes: ['app.js'],
            inlineCss: true,
            inlineScripts: true,
            stripComments: true,
            stripExcludes: false,
        }))
        .pipe(gulp.dest(distWeb));
});

gulp.task('default', ['vulcanize', 'compile']);

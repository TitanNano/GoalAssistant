/* eslint-env node */

const gulp = require('gulp');
const vulcanize = require('gulp-vulcanize');
const sass = require('gulp-sass');
const compiler = require('@af-modules/compiler');
const bundleTemplates = require('gulp-bundle-templates');
const rename = require('gulp-rename');
const symlink = require('gulp-sym');
const child_process = require('child_process');
const colors = require('colors');
const clean = require('gulp-clean');

const cache = '.cache/';
const dist = 'dist';
const distWeb = `${dist}/web`;

gulp.task('clean', () => {
    return gulp.src('dist', {read: false})
        .pipe(clean());
});

gulp.task('sass', ['clean'], () => {
    return gulp.src(['src/styles/main.scss'])
        .pipe(sass().on('error', sass.logError))
        .pipe(rename('app.css'))
        .pipe(gulp.dest(cache));
});

gulp.task('copy:cache', ['clean'], () => {
    return gulp.src(['src/**/*.html'])
        .pipe(gulp.dest(cache));
});

gulp.task('compile', ['vulcanize'], () => {
    const compile = compiler({
        cacheDir: '.cache/',
        outDir: distWeb,
        extensions: ['.js'],
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

gulp.task('platform:web', ['vulcanize', 'compile'], () => {
    return gulp.src('platforms/web/**')
        .pipe(gulp.dest('dist/web/'));
});

gulp.task('platform:cordova', ['vulcanize', 'compile'], () => {
    gulp.src('platforms/cordova')
        .pipe(symlink('dist/cordova'));

    return gulp.src('dist/web/**')
        .pipe(gulp.dest('dist/cordova/www/'));
});

gulp.task('platform:android', ['platform:cordova'], () => {
    child_process.execSync('cordova build android', { cwd: 'platforms/cordova', stdio: [0, 1, 2] });

    console.log(colors.cyan('moving APKs...'));

    return gulp.src(['platforms/cordova/platforms/android/build/outputs/apk/**'])
        .pipe(gulp.dest('dist/android/'));
});

gulp.task('run:android', [], () => {
    return child_process.execSync('cordova run android --nobuild', { cwd: 'platforms/cordova', stdio: [0, 1, 2]});
});

gulp.task('platform:android:run', ['platform:android'], () => {
    return child_process.execSync('cordova run android --nobuild', { cwd: 'platforms/cordova', stdio: [0, 1, 2]});
});

gulp.task('default', ['platform:web']);

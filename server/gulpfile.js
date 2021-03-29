const gulp = require("gulp");
const babel = require('gulp-babel');
const obfuscate = require('gulp-obfuscate');
const closureCompiler = require('gulp-closure-compiler');

gulp.task('babel', function() {
    return gulp.src('src/**/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(gulp.dest('dist'))
});

gulp.task('obfuscateJS', function() {
    return gulp.src('dist/**/*.js')
        .pipe(obfuscate({ replaceMethod: obfuscate.ZALGO }));
});

gulp.task("default", gulp.series('babel', 'obfuscateJS'));

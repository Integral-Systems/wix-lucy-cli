import gulp from 'gulp';
import { blue, red } from '../index.js';
export function copyFiles(options) {
    const { outputDir } = options;
    return () => {
        return gulp.src([
            'typescript/**/*',
            '!typescript/*tsconfig.json',
            '!typescript/**/*.ts',
            '!typescript/**/*.tsx',
            '!typescript/types/**/**',
            '!typescript/__mocks__/**/**',
            '!typescript/styles/**',
        ])
            .pipe(gulp.dest(outputDir))
            .on('error', function () {
            console.log("💩" + red.underline.bold(' => Copy of files failed!'));
            this.emit('end');
        })
            .on('end', function () { console.log("🐶" + blue.underline(' => Copy of files succeeded!')); });
    };
}
export function copyFilesLib(options) {
    const { outputDir } = options;
    return () => {
        return gulp.src([
            'typescript/**/*',
            '!typescript/*tsconfig.json',
            '!typescript/**/*.ts',
            '!typescript/**/*.tsx',
            '!typescript/types/**/**',
            '!typescript/__mocks__/**/**',
            '!typescript/styles/**',
        ])
            .pipe(gulp.dest(outputDir))
            .on('error', function () {
            console.log("💩" + red.underline.bold(' => Copy of files (LIB) failed!'));
            this.emit('end');
        })
            .on('end', function () { console.log("🐶" + blue.underline(' => Copy of files (LIB) succeeded!')); });
    };
}

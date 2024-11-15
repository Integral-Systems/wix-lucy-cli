import gulp from 'gulp';
import { createGulpEsbuild } from 'gulp-esbuild';
import * as path from 'path';
import { blue, red } from '../index.js';
export function buildPublic(options) {
    const { outputDir, enableIncrementalBuild } = options;
    const gulpEsbuild = createGulpEsbuild({
        incremental: enableIncrementalBuild,
    });
    return () => {
        return gulp.src([
            'typescript/public/**/*.ts',
            'typescript/public/**/*.tsx',
        ])
            .pipe(gulpEsbuild({
            bundle: false,
            loader: {
                '.tsx': 'tsx',
            },
        }))
            .pipe(gulp.dest(path.join(outputDir, 'public')))
            .on('error', function () {
            console.log("💩" + red.underline.bold(' => Build of Public TS files failed!'));
            this.emit('end');
        })
            .on('end', function () {
            console.log("🐶" + blue.underline(' => Build of Public TS files succeeded!'));
        });
    };
}
export function buildPublicLib(options) {
    const { outputDir, enableIncrementalBuild } = options;
    const gulpEsbuild = createGulpEsbuild({
        incremental: enableIncrementalBuild,
    });
    return () => {
        return gulp.src([
            'lib/public/**/*.ts',
            'lib/public/**/*.tsx'
        ])
            .pipe(gulpEsbuild({
            bundle: false,
            loader: {
                '.tsx': 'tsx',
            },
        }))
            .pipe(gulp.dest(path.join(outputDir, 'public')))
            .on('error', function () {
            console.log("💩" + red.underline.bold(' => Build of Public (LIB) TS files failed!'));
            this.emit('end');
        })
            .on('end', function () {
            console.log("🐶" + blue.underline(' => Build of Public (LIB) TS files succeeded!'));
        });
    };
}

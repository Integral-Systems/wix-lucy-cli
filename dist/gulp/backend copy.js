import chalk from 'chalk';
import gulp from 'gulp';
import { createGulpEsbuild } from 'gulp-esbuild';
import * as path from 'path';
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
        }))
            .pipe(gulp.dest(path.join(outputDir, 'public')))
            .on('error', function () {
            console.log(chalk.red.underline.bold('Build of Public TS files failed!'));
            this.emit('end');
        })
            .on('end', function () {
            console.log(chalk.blueBright.underline('Build of Public TS files succeeded!'));
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
            'wix-lucy-lib/src/public/**/*.ts',
            'wix-lucy-lib/src/public/**/*.tsx'
        ])
            .pipe(gulpEsbuild({
            bundle: false,
        }))
            .pipe(gulp.dest(path.join(outputDir, 'public')))
            .on('error', function () {
            console.log(chalk.red.underline.bold('Build of Public (LIB) TS files failed!'));
            this.emit('end');
        })
            .on('end', function () {
            console.log(chalk.blueBright.underline('Build of Public (LIB) TS files succeeded!'));
        });
    };
}

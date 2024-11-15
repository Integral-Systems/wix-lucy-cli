import gulp from 'gulp';
import chalk from 'chalk';
import { createGulpEsbuild } from 'gulp-esbuild';
import * as path from 'path';
export function buildPages(options) {
    const { outputDir, enableIncrementalBuild } = options;
    const gulpEsbuild = createGulpEsbuild({
        incremental: enableIncrementalBuild, // enables the esbuild's incremental build
    });
    return () => {
        return gulp.src('typescript/pages/*.ts')
            .pipe(gulpEsbuild({
            bundle: false,
        }))
            .pipe(gulp.dest(path.join(outputDir, 'pages')))
            .on('error', function () {
            console.log(chalk.red.underline.bold('Build of Pages TS files failed!'));
            this.emit('end');
        })
            .on('end', function () { console.log(chalk.blueBright.underline('Build of Pages TS files succeeded!')); });
    };
}

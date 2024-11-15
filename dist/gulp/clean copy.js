import chalk from 'chalk';
import gulp from 'gulp';
import { createGulpEsbuild } from 'gulp-esbuild';
import clean from 'gulp-clean';
export function cleanWix(options) {
    const { outputDir, enableIncrementalBuild } = options;
    const gulpEsbuild = createGulpEsbuild({
        incremental: enableIncrementalBuild,
    });
    return () => {
        return gulp.src('./.wix', { read: false, allowEmpty: true })
            .pipe(clean({ force: true }))
            .on('error', function () {
            console.log(chalk.red.underline.bold('Cleaning of .wix failed!'));
            this.emit('end');
        })
            .on('end', function () { console.log(chalk.blueBright.underline('Cleaning of .wix succeeded!')); });
    };
}

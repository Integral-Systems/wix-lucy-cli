import gulp from 'gulp';
import { TaskOptions } from '../Gulpfile';
import { createGulpEsbuild } from 'gulp-esbuild';
import * as path from 'path';
import { blue, red } from '../index.js';

export function buildPages(options: TaskOptions) {
    const { outputDir, enableIncrementalBuild} = options;
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
                console.log("💩" + red.underline.bold(' => Build of Pages TS files failed!'));
                this.emit('end');
            })
            .on('end', function() { console.log("🐶" + blue.underline(' => Build of Pages TS files succeeded!')); });
    };
}
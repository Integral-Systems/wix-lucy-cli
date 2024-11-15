import gulp from 'gulp';
import chalk from 'chalk';
import { TaskOptions } from '../Gulpfile';
import { blue, red } from '../index.js';

export function compileScss(options: TaskOptions) {
    const { sass, outputDir} = options;

    return () => {
        return 	gulp.src(['typescript/styles/global.scss'])
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest(`${outputDir}/styles`))
        .on('error', function () {
            console.log("💩" + red.underline.bold(' => Compiling of scss files failed!'));
            this.emit('end');
            })
            .on('end', function () {
            console.log("🐶" + blue.underline(' => Compiling of scss files succeeded!'));
            });
    };
}
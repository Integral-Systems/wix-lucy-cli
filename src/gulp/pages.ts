import gulp from 'gulp';
import { TaskOptions } from '../Gulpfile';
import * as path from 'path';
import { blue, orange, red } from '../index.js';
import swc from 'gulp-swc';

const swcOptions = {
    jsc: {
        target: 'es2020',
        parser: {
            syntax: "typescript",
            tsx: true,
        },
        preserveAllComments: false,
        minify: {
            compress: true // equivalent to {}
        }
    },
};

export function buildPages(options: TaskOptions) {
    const { outputDir} = options;

    return () => {
        return gulp.src('typescript/pages/*.ts')
            .pipe(swc(swcOptions))
                .on('error', function (e: Error) {
                    console.log("💩" + red.underline.bold(` => Build of Pages files failed!`));
                    console.log("💩" + red.underline.bold(` => Error: ${orange(e.message)}`));
                    this.emit('end');
                })
                .pipe(gulp.dest(path.join(outputDir, 'pages')))
                .on('error', function (e: Error) {
                    console.log("💩" + red.underline.bold(' => Build of Pages TS files failed!'));
                    console.log("💩" + red.underline.bold(` => Error: ${orange(e.message)}`));
                    this.emit('end');
                })
                .on('end', function() { console.log("🐶" + blue.underline(' => Build of Pages TS files succeeded!')); });
    };
}
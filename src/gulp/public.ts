import gulp from 'gulp';
import * as path from 'path';
import { TaskOptions } from '../Gulpfile';
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

export function buildPublic(options: TaskOptions) {
    const folders = ['typescript', ...options.modulesSourcePaths];

    const { outputDir } = options;

    // Create tasks for each folder
    const tasks = folders.map((folder) => {
        const taskName = `build_Public-${folder}`; // Create a unique name for each task

        const task = () =>
            gulp.src([
                `${folder}/public/**/*.ts`,
                `${folder}/public/**/*.tsx`,
            ])
                .pipe(swc(swcOptions))
                .on('error', function (e: Error) {
                    console.log("💩" + red.underline.bold(` => Build of Public files for ${orange(folder)} failed!`));
                    console.log("💩" + red.underline.bold(` => Error: ${orange(e.message)}`));
                    this.emit('end');
                })
                .pipe(gulp.dest(path.join(outputDir, 'public')))
                .on('error', function (e: Error) {
                    console.log("💩" + red.underline.bold(` => Build of Public files for ${orange(folder)} failed!`));
                    console.log("💩" + red.underline.bold(` => Error: ${orange(e.message)}`));
                    this.emit('end');
                })
                .on('end', function () {
                    console.log("🐶" + blue.underline(` => Build of Public files for ${orange(folder)} succeeded!`));
                });

        // Register the task with Gulp
        Object.defineProperty(task, 'name', { value: taskName }); // Set a unique name for debugging
        return task;
    });

    // Run all tasks in parallel
    return gulp.parallel(...tasks);
}


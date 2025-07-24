import gulp from 'gulp';
import rename from 'gulp-rename';
import * as path from 'path';
import { TaskOptions } from '../Gulpfile';
import { blue, orange, red } from '../index.js';
import swc from 'gulp-swc';
import { cond } from 'cypress/types/lodash';

const swcOptions = {
    jsc: {
        target: 'es2020',
        parser: {
            syntax: "typescript",
            tsx: true,
            decorators: true,
            // preserveAllComments: true
        },
        preserveAllComments: false,
        minify: {
            compress: true // equivalent to {}
        }
    },
};

export function buildBackend(options: TaskOptions) {
    const folders = ['typescript', ...options.modulesSourcePaths];

    const { outputDir } = options;

    // Create tasks for each folder
    const tasks = folders.map((folder) => {
        const taskName = `build_Backend-${folder}`; // Create a unique name for each task

        const task = () =>
            gulp.src([
                `${folder}/backend/**/*.ts`,
                `${folder}/backend/**/*.tsx`,
                `!${folder}/backend/**/*.jsw.ts`,
                `!${folder}/backend/**/*.spec.ts`,
            ])
                .pipe(swc(swcOptions))
                .on('error', function (e: Error) {
                    console.log("💩" + red.underline.bold(` => Build of Backend files for ${orange(folder)} failed!`));
                    console.log("💩" + red.underline.bold(` => Error: ${orange(e.message)}`));
                    this.emit('end');
                })
                .pipe(gulp.dest(path.join(outputDir, 'backend')))
                .on('error', function (e: Error) {
                    console.log("💩" + red.underline.bold(` => Build of Backend files for ${orange(folder)} failed!`));
                    console.log("💩" + red.underline.bold(` => Error: ${orange(e.message)}`));
                    this.emit('end');
                })
                .on('end', function () {
                    console.log("🐶" + blue.underline(` => Build of Backend files for ${orange(folder)} succeeded!`));
                });

        // Register the task with Gulp
        Object.defineProperty(task, 'name', { value: taskName }); // Set a unique name for debugging
        return task;
    });

    // Run all tasks in parallel
    return gulp.parallel(...tasks);
}


export function buildBackendJSW(options: TaskOptions) {
    const folders = ['typescript', ...options.modulesSourcePaths];

    const swcOptions = {
        jsc: {
            target: 'es6',
        },
    };
    const { outputDir } = options;

    // Create tasks for each folder
    const tasks = folders.map((folder) => {
        const taskName = `build-${folder}`; // Create a unique name for each task

        const task = () =>
            gulp.src([
                `${folder}/backend/**/*.jsw.ts`,
            ])
            .pipe(swc(swcOptions))
            .on('error', function (e: Error) {
                console.log("💩" + red.underline.bold(` => Build of Public files for ${orange(folder)} failed!`));
                console.log("💩" + red.underline.bold(` => Error: ${orange(e.message)}`));
                this.emit('end');
            })
            .pipe(rename({ extname: '' }))
            .pipe(gulp.dest(path.join(outputDir, 'backend')))
            .on('error', function (e: Error) {
                console.log("💩" + red.underline.bold(` => Build of JSW files for ${orange(folder)} failed!`));
                console.log("💩" + red.underline.bold(` => Error: ${orange(e.message)}`));
                this.emit('end');
            })
            .on('end', function () {
                console.log("🐶" + blue.underline(` => Build of JSW files for ${orange(folder)} succeeded!`));
            });

        // Register the task with Gulp
        Object.defineProperty(task, 'name', { value: taskName }); // Set a unique name for debugging
        return task;
    });

    // Run all tasks in parallel
    return gulp.parallel(...tasks);
}
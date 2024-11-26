import gulp from 'gulp';
import rename from 'gulp-rename';
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
    },
};
export function buildBackend(options) {
    const folders = ['typescript'];
    if (options.modulesSync) {
        for (const module of Object.keys(options.modulesSync)) {
            folders.push(module);
        }
    }
    const { outputDir } = options;
    // Create tasks for each folder
    const tasks = folders.map((folder) => {
        const taskName = `build_Backend-${folder}`; // Create a unique name for each task
        const task = () => gulp.src([
            `${folder}/backend/**/*.ts`,
            `${folder}/backend/**/*.tsx`,
            `!${folder}/backend/**/*.jsw.ts`,
            `!${folder}/backend/**/*.spec.ts`,
        ])
            .pipe(swc(swcOptions))
            .pipe(swc(swcOptions))
            .on('error', function (e) {
            console.log("💩" + red.underline.bold(` => Build of Backend files for ${orange(folder)} failed!`));
            console.log("💩" + red.underline.bold(` => Error: ${orange(e.message)}`));
            this.emit('end');
        })
            .pipe(gulp.dest(path.join(outputDir, 'backend')))
            .on('error', function (e) {
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
export function buildBackendJSW(options) {
    const folders = ['typescript'];
    if (options.modulesSync) {
        for (const module of Object.keys(options.modulesSync)) {
            folders.push(module);
        }
    }
    const swcOptions = {
        jsc: {
            target: 'es6',
        },
    };
    const { outputDir } = options;
    // Create tasks for each folder
    const tasks = folders.map((folder) => {
        const taskName = `build-${folder}`; // Create a unique name for each task
        const task = () => gulp.src([
            `${folder}/backend/**/*.jsw.ts`,
        ])
            .pipe(swc(swcOptions))
            .on('error', function (e) {
            console.log("💩" + red.underline.bold(` => Build of Public files for ${orange(folder)} failed!`));
            console.log("💩" + red.underline.bold(` => Error: ${orange(e.message)}`));
            this.emit('end');
        })
            .pipe(rename({ extname: '' }))
            .pipe(gulp.dest(path.join(outputDir, 'backend')))
            .on('error', function (e) {
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

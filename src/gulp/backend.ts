import gulp from 'gulp';
import { createGulpEsbuild } from 'gulp-esbuild';
import rename from 'gulp-rename';
import * as path from 'path';
import { TaskOptions } from '../Gulpfile';
import { blue, orange, red } from '../index.js';

export function buildBackend(options: TaskOptions) {
    const folders = ['typescript'];
    if (options.modulesSync){
        for (const module of Object.keys(options.modulesSync)) {
            folders.push(module);
        }
    }

    const { outputDir, enableIncrementalBuild } = options;
    const gulpEsbuild = createGulpEsbuild({
        incremental: enableIncrementalBuild,
        pipe: true,
    });

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
                .pipe(
                    gulpEsbuild({
                        bundle: false,
                    })
                )
                .pipe(gulp.dest(path.join(outputDir, 'backend')))
                .on('error', function () {
                    console.log("💩" + red.underline.bold(` => Build of Backend files for ${orange(folder)} failed!`));
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
    const folders = ['typescript'];
    if (options.modulesSync){
        for (const module of Object.keys(options.modulesSync)) {
            folders.push(module);
        }
    }

    const { outputDir, enableIncrementalBuild } = options;
    const gulpEsbuild = createGulpEsbuild({
        incremental: enableIncrementalBuild,
        pipe: true,
    });

    // Create tasks for each folder
    const tasks = folders.map((folder) => {
        const taskName = `build-${folder}`; // Create a unique name for each task

        const task = () =>
            gulp.src([
                `${folder}/backend/**/*.jsw.ts`,
            ])
                .pipe(
                    gulpEsbuild({
                        bundle: false,
                    })
                )
                .pipe(rename({ extname: '' }))
                .pipe(gulp.dest(path.join(outputDir, 'backend')))
                .on('error', function () {
                    console.log("💩" + red.underline.bold(` => Build of JSW files for ${orange(folder)} failed!`));
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
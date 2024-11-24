import gulp from 'gulp';
import { createGulpEsbuild } from 'gulp-esbuild';
import * as path from 'path';
import { blue, orange, red } from '../index.js';
export function buildPublic(options) {
    const folders = ['typescript'];
    if (options.modulesSync) {
        for (const module of Object.keys(options.modulesSync)) {
            folders.push(module);
        }
    }
    const { outputDir, enableIncrementalBuild } = options;
    const gulpEsbuild = createGulpEsbuild({
        incremental: enableIncrementalBuild,
    });
    // Create tasks for each folder
    const tasks = folders.map((folder) => {
        const taskName = `build_Public-${folder}`; // Create a unique name for each task
        const task = () => gulp.src([
            `${folder}/public/**/*.ts`,
            `${folder}/public/**/*.tsx`,
        ])
            .pipe(gulpEsbuild({
            bundle: false,
            loader: {
                '.tsx': 'tsx',
            },
        }))
            .pipe(gulp.dest(path.join(outputDir, 'public')))
            .on('error', function () {
            console.log("💩" + red.underline.bold(` => Build of Public files for ${orange(folder)} failed!`));
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

import gulp from 'gulp';
import * as path from 'path';
import swc from 'gulp-swc';
import { logger } from '../../utils/logger.js';
import { TaskOptions } from '../../schemas/gulp.js';
import { TaskType } from '../../schemas/types.js';

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

export function buildPublic(options: TaskOptions): TaskType {
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
                    logger.error(`Build of Public files for ${folder} failed!`);
                    logger.error(`Error: ${e.message}`);

                    this.emit('end');
                })
                .pipe(gulp.dest(path.join(outputDir, 'public')))
                .on('error', function (e: Error) {
                    logger.error(`Build of Public files for ${folder} failed!`);
                    logger.error(`Error: ${e.message}`);
                    this.emit('end');
                })
                .on('end', function () {
                    logger.success(`Build of Public files for ${folder} succeeded!`);
                });

        // Register the task with Gulp
        Object.defineProperty(task, 'name', { value: taskName }); // Set a unique name for debugging
        return task;
    });

    // Run all tasks in parallel
    return gulp.parallel(...tasks);
}


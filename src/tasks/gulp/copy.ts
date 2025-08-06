import gulp from 'gulp';
import { logger } from '../../utils/logger.js';
import { TaskOptions } from '../../schemas/gulp.js';
import { TaskType } from '../../schemas/types.js';

export function copyFiles(options: TaskOptions): TaskType {
    const folders = ['typescript', ...options.modulesSourcePaths];
    const tasks = folders.map((folder) => {
		const { outputDir} = options;
        const taskName = `copy-${folder}`; // Create a unique name for each task
        const task = () =>
			gulp.src([
				`${folder}/**/*`, 
				`!${folder}/*tsconfig.json`, 
				`!${folder}/**/*.ts`, 
				`!${folder}/**/*.tsx`, 
				`!${folder}/types/**/**`, 
				`!${folder}/__mocks__/**/**`, 
				`!${folder}/styles/**`,
			])
			.pipe(gulp.dest(outputDir))
                .on('error', function (e: Error) {
                    logger.error(`Copy of files for ${folder} failed!`);
                    logger.error(`Error: ${e.message}`);
                    this.emit('end');
                })
                .on('end', function () {
                    logger.success(`Copy of files for ${folder} succeeded!`);
                });

        // Register the task with Gulp
        Object.defineProperty(task, 'name', { value: taskName }); // Set a unique name for debugging
        return task;
    });
    const t = gulp.parallel(...tasks);
    // Run all tasks in parallel
    return gulp.parallel(...tasks);
}

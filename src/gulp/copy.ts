import gulp from 'gulp';
import chalk from 'chalk';
import { TaskOptions } from '../Gulpfile';
import { blue, orange, red } from '../index.js';

export function copyFiles(options: TaskOptions) {
    const folders = ['typescript'];
    if (options.modulesSync){
        for (const module of Object.keys(options.modulesSync)) {
            folders.push(module);
        }
    }

    // Create tasks for each folder
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
                    console.log("💩" + red.underline.bold(` => Copy of files for ${orange(folder)} failed!`));
                    console.log("💩" + red.underline.bold(` => Error: ${orange(e.message)}`));
                    this.emit('end');
                })
                .on('end', function () {
                    console.log("🐶" + blue.underline(` => Copy of files for ${orange(folder)} succeeded!`));
                });

        // Register the task with Gulp
        Object.defineProperty(task, 'name', { value: taskName }); // Set a unique name for debugging
        return task;
    });

    // Run all tasks in parallel
    return gulp.parallel(...tasks);
}

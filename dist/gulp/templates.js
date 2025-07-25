import gulp from 'gulp';
import exec from 'gulp-exec';
import { blue, orange, red } from '../index.js';
export function previewTemplates(options) {
    const folders = ['typescript', ...options.modulesSourcePaths];
    const taskOpt = {
        continueOnError: true,
    };
    // Create tasks for each folder
    const tasks = folders.map((folder) => {
        const taskName = `render_templates-${folder}`; // Create a unique name for each task
        const task = () => gulp.src([
            `${folder}/backend/templates/**/*.tsx`,
            `${folder}/backend/templates/data/*.json`,
            `!${folder}/backend/templates/render.ts`,
        ])
            .pipe(exec((file) => `npx tsx --tsconfig ./local.tsconfig.json ${file.path}`, taskOpt))
            .on('error', function (e) {
            console.log("💩" + red.underline.bold(` => Render of Template for ${orange(folder)} failed!`));
            console.log("💩" + red.underline.bold(` => Error: ${orange(e.message)}`));
            this.emit('end');
        })
            .on('end', function () {
            console.log("🐶" + blue.underline(` => Render of Template for ${orange(folder)} succeeded!`));
        });
        // Register the task with Gulp
        Object.defineProperty(task, 'name', { value: taskName }); // Set a unique name for debugging
        return task;
    });
    // Run all tasks in parallel
    return gulp.parallel(...tasks);
}

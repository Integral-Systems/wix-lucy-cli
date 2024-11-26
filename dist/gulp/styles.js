import gulp from 'gulp';
import { blue, orange, red } from '../index.js';
export function compileScss(options) {
    const folders = ['typescript'];
    // if (options.modulesSync){
    //     for (const module of Object.keys(options.modulesSync)) {
    //         folders.push(module);
    //     }
    // }
    const { sass, outputDir } = options;
    // Create tasks for each folder
    const tasks = folders.map((folder) => {
        const taskName = `compile_sass-${folder}`; // Create a unique name for each task
        const task = () => gulp.src(['typescript/styles/global.scss'])
            .pipe(sass().on('error', sass.logError))
            .on('error', function (e) {
            console.log("💩" + red.underline.bold(` => Build of SCSS files for ${orange(folder)} failed!`));
            console.log("💩" + red.underline.bold(` => Error: ${orange(e.message)}`));
            this.emit('end');
        })
            .pipe(gulp.dest(`${outputDir}/styles`))
            .on('error', function (e) {
            console.log("💩" + red.underline.bold(` => Compiling of scss files for ${orange(folder)} failed!`));
            console.log("💩" + red.underline.bold(` => Error: ${orange(e.message)}`));
            this.emit('end');
        })
            .on('end', function () {
            console.log("🐶" + blue.underline(` => Compiling of scss files for ${orange(folder)} succeeded!`));
        });
        // Register the task with Gulp
        Object.defineProperty(task, 'name', { value: taskName }); // Set a unique name for debugging
        return task;
    });
    // Run all tasks in parallel
    return gulp.parallel(...tasks);
}

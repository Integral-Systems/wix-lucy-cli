import gulp from 'gulp';
import { blue, orange, red } from '../index.js';
import gulpJest from 'gulp-jest';
import { TaskOptions } from '../Gulpfile.js';
const jest = gulpJest.default;

export function test(options: TaskOptions) {
    const folders = ['typescript'];
    if (options.modulesSync){
        for (const module of Object.keys(options.modulesSync)) {
            folders.push(module);
        }
    }
    
    // Create tasks for each folder
    const tasks = folders.map((folder) => {
        const taskName = `tests-${folder}`; // Create a unique name for each task
        const task = () =>
            gulp.src([
                `${folder}/backend/**/*.spec.ts`,
            ])
            .pipe(jest({
                verbose: true,
                extensionsToTreatAsEsm: ['.ts'],
                transform: {
                    '^.+\\.tsx?$': [
                        'ts-jest',
                        {
                            tsconfig: `./${folder}/tsconfig.json`,
                            usESM: true,
                        },
                    ],
                },
                preset: 'ts-jest',
                setupFilesAfterEnv: [],
                testEnvironment: 'node',
                collectCoverage: true,
                coverageDirectory: './coverage',
                coverageReporters: ['clover', 'json', 'lcov', 'text'],
                rootDir: `./${folder}`,
                testMatch: ['**/*.spec.ts'],
                passWithNoTests: true,
                moduleNameMapper: {
                    'public/(.*)': '<rootDir>/public/$1'
                }
            }))
                .on('error', function () {
                    console.log("💩" + red.underline.bold(` => Tests for ${orange(folder)} failed!`));
                    this.emit('end');
                })
                .on('end', function () {
                    console.log("🐶" + blue.underline(` => Tests for ${orange(folder)} succeeded!`));
                });

        // Register the task with Gulp
        Object.defineProperty(task, 'name', { value: taskName }); // Set a unique name for debugging
        return task;
    });

    // Run all tasks in parallel
    return gulp.parallel(...tasks);
}
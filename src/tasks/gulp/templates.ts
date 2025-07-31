import gulp from 'gulp';
import { File, TaskOptions } from '../Gulpfile.js';
import exec from 'gulp-exec';
import { logger, orange } from '../../utils/logger.js';
import path from 'path';
import fs from 'fs';

export function previewTemplates(options: TaskOptions) {
        const allFolders = ['typescript', ...options.modulesSourcePaths];
        
        // Filter folders to only include those that have a 'backend/templates' directory
        const foldersWithTemplates = allFolders.filter(folder => {
            const templateDir = path.join(folder, 'backend', 'templates');
            return fs.existsSync(templateDir);
        });

        if (foldersWithTemplates.length === 0) {
            logger.info("No template folders found to preview.");
            // Return a Gulp task that does nothing.
            return (done: () => void) => done();
        }

        const taskOpt = {
            continueOnError: true,
        };
    
        // Create tasks for each folder that has a template directory
        const tasks = foldersWithTemplates.map((folder) => {
            const taskName = `render_templates-${folder}`;
            const task = () =>
                gulp.src([
                    `${folder}/backend/templates/**/*.tsx`, 
                    `${folder}/backend/templates/data/*.json`, 
                    `!${folder}/backend/templates/render.ts`,
                ])
                .pipe(exec((file: File) => `npx tsx --tsconfig ./local.tsconfig.json ${file.path}`, taskOpt))
                    .on('error', function (e: Error) {
                        logger.error(` => Render of Template for ${orange(folder)} failed!`);
                        logger.error(` => Error: ${orange(e.message)}`);
                        this.emit('end');
                    })
                    .on('end', function () {
                        logger.success(` => Render of Template for ${orange(folder)} succeeded!`);
                    });
    
            // Register the task with Gulp
            Object.defineProperty(task, 'name', { value: taskName }); // Set a unique name for debugging
            return task;
        });
    
        // Run all tasks in parallel
        return gulp.parallel(...tasks);
}
import gulp from 'gulp';
import * as path from 'path';
import replace from 'gulp-string-replace';
import { logger } from '../../utils/logger.js';
import { File } from "../../schemas/gulp.js";
export function setProdConfig() {
    const tag = process.env.GIT_TAG || 'development';
    const regexGit = /gitTag:\s*(.*),/g;
    const regexDev = /devMode:\s*(.*),/g;

    return () => {
        return gulp
            .src(['./typescript/public/constants/env.ts']) 
            .pipe(replace(regexGit, `gitTag: '${tag}',`))
            .pipe(replace(regexDev, `devMode: false,`))
            .pipe(gulp.dest((file: File) => {
                const filePath = file.dirname;
                const outputDir = path.dirname(filePath);
        
                return path.join(`${outputDir}/constants`);
            }))
            .on('error', function (e: Error) {
                logger.error(' => Setting the git tag failed!');
                logger.error(` => Error: ${e.message}`);
                this.emit('end');
            })
            .on('end', function() {
                logger.success(' => Setting the git tag succeeded!');
            });
    }
}

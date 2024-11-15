import gulp from 'gulp';
import * as path from 'path';
import { File } from '../Gulpfile';
import replace from 'gulp-string-replace';
import { blue, red } from '../index.js';

export function setProdConfig() {
    const droneTag = process.env.DRONE_TAG || 'development';
    const regexGit = /gitTag:\s*(.*),/g;
    const regexDev = /devMode:\s*(.*),/g;

    return () => {
        return gulp
            .src(['./typescript/public/constants/config.ts']) 
            .pipe(replace(regexGit, `gitTag: '${droneTag}',`))
            .pipe(replace(regexDev, `devMode: false,`))
            .pipe(gulp.dest((file: File) => {
                const filePath = file.dirname;
                const outputDir = path.dirname(filePath);
        
                return path.join(`${outputDir}/constants`);
            }))
            .on('error', function () {
                console.log("💩" + red.underline.bold(' => Setting the git tag failed!'));
                this.emit('end');
            })
            .on('end', function() { console.log("🐶" + blue.underline(' => Setting the git tag succeeded!')); 
        });
    }
}

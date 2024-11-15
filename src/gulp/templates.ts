import gulp from 'gulp';
import { File } from '../Gulpfile';
import exec from 'gulp-exec';
import { blue, red } from '../index.js';

export function previewTemplates() {
    const options = {
        continueOnError: true,
    };

    return () => {
        return gulp.src([
            'typescript/backend/templates/**/*.tsx', 
            'typescript/backend/templates/data/*.json', 
            '!typescript/backend/templates/render.ts',
        ])
            .pipe(exec((file: File) => `npx ts-node-esm -T ${file.path}`, options))
            .on('error', function () {
                console.log("💩" + red.underline.bold(' => Render of Template failed!'));
                this.emit('end');
            })
            .on('end', function() { console.log("🐶" + blue.underline(' => Render of Template succeeded!')); });
        };
}

export function previewTemplatesLib() {
    const options = {
        continueOnError: true,
    };

    return () => {
        return gulp.src([
            'lib/backend/templates/**/*.tsx', 
            'lib/backend/templates/data/*.json', 
            '!lib/backend/templates/render.ts',
        ])
            .pipe(exec((file: File) => `npx ts-node-esm -T ${file.path}`, options))
            .on('error', function () {
                console.log("💩" + red.underline.bold(' => Render of Template (LIB) failed!'));
                this.emit('end');
            })
            .on('end', function() { console.log("🐶" + blue.underline(' => Render of Template (LIB) succeeded!')); });
        };
}
import gulp from 'gulp';
import { green } from '../index.js';
import { buildBackend } from './backend.js';
import { buildPublic } from './public.js';
import { buildPages } from './pages.js';
import { copyFiles } from './copy.js';
import { previewTemplates } from './templates.js';
import { checkTs } from './checks.js';
import shell from 'gulp-shell';
let taskOptions;
export function watchSCSS() {
    return gulp.watch([
        '*/styles/**/*.scss'
    ], gulp.parallel('scss'));
}
export function watchBackend() {
    return gulp.watch([
        '*/backend/**/*.ts',
        '*/backend/**/*.tsx',
        '!*/backend/**/*.jsw.ts',
        '!src/**/**',
    ], gulp.parallel(checkTs(taskOptions), buildBackend(taskOptions), shell.task([
        'yarn docs',
    ])));
}
export function watchPublic() {
    return gulp.watch([
        '*/public/**/*.ts',
        '*/public/**/*.tsx',
    ], gulp.parallel(checkTs(taskOptions), buildPublic(taskOptions), shell.task([
        'yarn docs',
    ])));
}
export function watchPages() {
    return gulp.watch('typescript/pages/**/*.ts', gulp.parallel(checkTs(taskOptions), buildPages(taskOptions)));
}
export function watchFiles() {
    return gulp.watch([
        '*/backend/**/*',
        '*/public/**/*',
        '*/pages/**/*',
        '!*/**/*.ts',
        '!*/**/*.tsx',
    ], gulp.parallel(copyFiles(taskOptions)));
}
export function watchTemplates() {
    return gulp.watch([
        '*/backend/templates/**/*.tsx',
        '*/backend/templates/data/*.json',
        '!*/backend/templates/render.ts',
    ], gulp.parallel(previewTemplates(taskOptions), checkTs(taskOptions)));
}
export function watchTypes() {
    return gulp.watch([
        './.wix/types/**/*.d.ts',
        '!./.wix/types/wix-code-types'
    ], gulp.series('fix-wixtypes'));
}
export function watchAll(options) {
    taskOptions = options;
    console.log("🐕" + green.underline.bold(' => Adding watchers...'));
    return gulp.parallel(watchSCSS, watchBackend, watchPublic, watchPages, watchFiles, watchTemplates, watchTypes);
}

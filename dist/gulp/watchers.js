import gulp from 'gulp';
import { green } from '../index.js';
import { buildBackend, buildBackendJSW, buildBackendJSWLib, buildBackendLib } from './backend.js';
import { buildPublic, buildPublicLib } from './public.js';
import { buildPages } from './pages.js';
import { copyFiles, copyFilesLib } from './copy.js';
import { previewTemplates, previewTemplatesLib } from './templates.js';
import { checkTs, checkTsLib } from './checks.js';
import { testLib, test } from './test.js';
let taskOptions;
export function watchSCSS() {
    return gulp.watch([
        'typescript/styles/**/*.scss',
        'lib/styles/**/*.scss'
    ], gulp.parallel('scss'));
}
export function watchBackend() {
    return gulp.watch([
        'typescript/backend/**/*.ts',
        'typescript/backend/**/*.tsx',
        '!typescript/backend/**/*.spec.ts',
        '!typescript/backend/**/*.jsw.ts',
    ], gulp.parallel(test(), checkTs(), buildBackend(taskOptions)));
}
export function watchBackendLib() {
    return gulp.watch([
        'lib/backend/**/*.ts',
        'lib/backend/**/*.tsx',
        '!lib/backend/**/*.spec.ts',
        '!lib/backend/**/*.jsw.ts',
    ], gulp.parallel(testLib(), checkTsLib(), buildBackendLib(taskOptions)));
}
export function watchJSW() {
    return gulp.watch(['typescript/backend/**/*.jsw.ts'], gulp.parallel(test(), checkTs(), buildBackendJSW(taskOptions)));
}
export function watchJSWLib() {
    return gulp.watch(['lib/backend/**/*.jsw.ts'], gulp.parallel(testLib(), checkTsLib(), buildBackendJSWLib(taskOptions)));
}
export function watchPublic() {
    return gulp.watch([
        'typescript/public/**/*.ts',
        'typescript/public/**/*.tsx',
    ], gulp.parallel(test(), checkTs(), buildPublic(taskOptions)));
}
export function watchPublicLib() {
    return gulp.watch([
        'lib/public/**/*.ts',
        'lib/public/**/*.tsx',
    ], gulp.parallel(testLib(), checkTsLib(), buildPublicLib(taskOptions)));
}
export function watchPages() {
    return gulp.watch('typescript/pages/**/*.ts', gulp.parallel(checkTs(), buildPages(taskOptions)));
}
export function watchFiles() {
    return gulp.watch([
        'typescript/backend/**/*',
        'typescript/public/**/*',
        'typescript/pages/**/*',
        '!typescript/**/*.ts',
    ], gulp.parallel(copyFiles(taskOptions)));
}
export function watchFilesLib() {
    return gulp.watch([
        'lib/backend/**/*',
        'lib/public/**/*',
        'lib/pages/**/*',
        '!lib/**/*.ts',
    ], gulp.parallel(copyFilesLib(taskOptions)));
}
export function watchTemplates() {
    return gulp.watch([
        'typescript/backend/templates/**/*.tsx',
        'typescript/backend/templates/data/*.json',
        '!typescript/backend/templates/render.ts',
    ], gulp.parallel(previewTemplates(), test()));
}
export function watchTemplatesLib() {
    return gulp.watch([
        'lib/backend/templates/**/*.tsx',
        'lib/backend/templates/data/*.json',
        '!lib/backend/templates/render.ts',
    ], gulp.parallel(previewTemplatesLib(), testLib()));
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
    return gulp.parallel(watchSCSS, watchBackend, watchBackendLib, watchJSW, watchJSWLib, watchPublic, watchPublicLib, watchPages, watchFilesLib, watchFiles, watchTemplates, watchTemplatesLib, watchTypes);
}

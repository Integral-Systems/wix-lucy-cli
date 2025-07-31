import gulp from 'gulp';
import { buildBackend } from './backend.js';
import { buildPublic } from './public.js';
import { buildPages } from './pages.js';
import { copyFiles } from './copy.js';
import { previewTemplates } from './templates.js';
import { checkTs } from './checks.js';
import { TaskOptions } from '../../schemas/gulp.js';
let taskOptions: TaskOptions;

export function watchSCSS() {
    return gulp.watch([
        '*/styles/**/*.scss'
    ], 
        gulp.parallel('scss')
    );
}

export function watchBackend() {
    return 	gulp.watch([
		'*/backend/**/*.ts', 
		'*/backend/**/*.tsx', 
        '!*/backend/**/*.jsw.ts', 
        '!src/**/**',
	], gulp.parallel(
        checkTs(taskOptions),
        buildBackend(taskOptions),
        // shell.task([
        //     'yarn docs',
        // ])
    ));
}

export function watchPublic() {
    return gulp.watch([
		'*/public/**/*.ts', 
		'*/public/**/*.tsx',
	], gulp.parallel(
        checkTs(taskOptions),
        buildPublic(taskOptions),
        // shell.task([
        //     'yarn docs',
        // ])
    ));
}

export function watchPages() {
    return 	gulp.watch('typescript/pages/**/*.ts', 
    gulp.parallel(
        checkTs(taskOptions),
        buildPages(taskOptions),
        )
    );
}

export function watchFiles() {
    return 	gulp.watch([
		'*/backend/**/*', 
		'*/public/**/*', 
		'*/pages/**/*', 
		'!*/**/*.ts',
        '!*/**/*.tsx',
	], gulp.parallel(copyFiles(taskOptions)));
}

export function watchTemplates() {
    return	gulp.watch([
		'*/backend/templates/**/*.tsx', 
		'*/backend/templates/data/*.json', 
		'!*/backend/templates/render.ts',
	], gulp.parallel(
        previewTemplates(taskOptions),
        checkTs(taskOptions),
        )
    );
}

export function watchTypes() {
    return gulp.watch([
        './.wix/types/**/*.d.ts', 
        '!./.wix/types/wix-code-types'
    ], 
    gulp.series(
        'fix-wix-types'
        )
    );
}

export function watchAll(options: TaskOptions) {
    taskOptions = options;
    return gulp.parallel(
        watchSCSS,
        watchBackend,
        watchPublic,
        watchPages,
        watchFiles,
        watchTemplates,
        watchTypes,
    );
}

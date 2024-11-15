import gulp from 'gulp';
import chalk from 'chalk';
import { TaskOptions } from '../Gulpfile';
import { blue, red } from '../index.js';

export function copyFiles(options: TaskOptions) {
    const { outputDir} = options;

    return () => {
        return gulp.src([
			'typescript/**/*', 
			'!typescript/*tsconfig.json', 
			'!typescript/**/*.ts', 
			'!typescript/**/*.tsx', 
			'!typescript/types/**/**', 
			'!typescript/__mocks__/**/**', 
			'!typescript/styles/**',
		])
		.pipe(gulp.dest(outputDir))
		.on('error', function () {
			console.log("💩" + red.underline.bold(' => Copy of files failed!'));
			this.emit('end');
		})
		.on('end', function() { console.log("🐶" + blue.underline(' => Copy of files succeeded!')); });
    }
}

export function copyFilesLib(options: TaskOptions) {
    const { outputDir} = options;

    return () => {
        return gulp.src([
			'typescript/**/*', 
			'!typescript/*tsconfig.json', 
			'!typescript/**/*.ts', 
			'!typescript/**/*.tsx', 
			'!typescript/types/**/**', 
			'!typescript/__mocks__/**/**', 
			'!typescript/styles/**',
		])
		.pipe(gulp.dest(outputDir))
		.on('error', function () {
			console.log("💩" + red.underline.bold(' => Copy of files (LIB) failed!'));
			this.emit('end');
		})
		.on('end', function() { console.log("🐶" + blue.underline(' => Copy of files (LIB) succeeded!')); });
    }
}
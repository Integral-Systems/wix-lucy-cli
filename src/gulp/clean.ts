import chalk from 'chalk';
import gulp from 'gulp';
import { TaskOptions } from '../Gulpfile';
import clean from 'gulp-clean';
import { blue, red } from '../index.js';

export function cleanWix() {	
    return () => {
        return gulp.src('./.wix', { read: false, allowEmpty: true })
		.pipe(clean({ force: true }))
		.on('error', function () {
			console.log("💩" + red.underline.bold(' => Cleaning of .wix failed!'));
			this.emit('end');
		})
		.on('end', function() { console.log("🐶" + blue.underline(' => Cleaning of .wix succeeded!')); });
    }
}

export function cleanSrc(options: TaskOptions) {
	const { outputDir } = options;

	return () => {
		return gulp.src([`${outputDir}/pages`, `${outputDir}/public`, `${outputDir}/backend`], { read: false, allowEmpty: true })
		.pipe(clean({ force: true }))
		.on('error', function () {
			console.log("💩" + red.underline.bold('Cleaning of output files failed!'));
			this.emit('end');
		})
		.on('end', function() { console.log("🐶" + blue.underline(' => Cleaning of .src succeeded!')); });
	}
}

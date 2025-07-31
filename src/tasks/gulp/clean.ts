import gulp from 'gulp';
import clean from 'gulp-clean';
import { logger } from '../../utils/logger.js';
import { TaskOptions } from '../../schemas/gulp.js';

export function cleanWix() {	
    return () => {
        return gulp.src('./.wix', { read: false, allowEmpty: true })
		.pipe(clean({ force: true }))
		.on('error', function (e: Error) {
			logger.error('Cleaning of .wix failed!');
			logger.error(`Error: ${e.message}`);


			this.emit('end');
		})
		.on('end', function() { 
			logger.success("Cleaning of .wix succeeded!");
		});
    }
}

export function cleanSrc(options: TaskOptions) {
	const { outputDir } = options;

	return () => {
		return gulp.src([`${outputDir}/pages`, `${outputDir}/public`, `${outputDir}/backend`], { read: false, allowEmpty: true })
		.pipe(clean({ force: true }))
		.on('error', function (e: Error) {
			logger.error('Cleaning of output files failed!');
			logger.error(` => Error: ${e.message}`);
			this.emit('end');
		})
		.on('end', function() {
			logger.success('Cleaning of .src succeeded!');
		});
	}
}

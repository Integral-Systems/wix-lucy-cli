import gulp from 'gulp';
import { logger, orange } from '../../utils/logger.js';
export function compileScss(options) {
    const folders = ['typescript'];
    const { sass, outputDir } = options;
    const buildWixScss = () => gulp.src(['typescript/styles/global.scss'], { allowEmpty: true })
        .pipe(sass().on('error', sass.logError))
        .on('error', function (e) {
        logger.error(` => Build of SCSS files for ${orange('global.scs')} failed!`);
        logger.error(` => Error: ${orange(e.message)}`);
        this.emit('end');
    })
        .pipe(gulp.dest(`${outputDir}/styles`))
        .on('error', function (e) {
        logger.error(` => Compiling of scss files for ${orange('global.scs')} failed!`);
        logger.error(` => Error: ${orange(e.message)}`);
        this.emit('end');
    })
        .on('end', function () {
        logger.success(` => Compiling of scss files for ${orange('global.scs')} succeeded!`);
    });
    const buildScss = () => gulp.src(['typescript/public/scss/app.scss'], { allowEmpty: true })
        .pipe(sass().on('error', sass.logError))
        .on('error', function (e) {
        logger.error(` => Build of SCSS files for ${orange('app.scss')} failed!`);
        logger.error(` => Error: ${orange(e.message)}`);
        this.emit('end');
    })
        .pipe(gulp.dest(`${outputDir}/public/css`))
        .on('error', function (e) {
        logger.error(` => Compiling of scss files for ${orange('app.scss')} failed!`);
        logger.error(` => Error: ${orange(e.message)}`);
        this.emit('end');
    })
        .on('end', function () {
        logger.success(` => Compiling of scss files for ${orange('app.scss')} succeeded!`);
    });
    return gulp.parallel(buildWixScss, buildScss);
}
//# sourceMappingURL=styles.js.map
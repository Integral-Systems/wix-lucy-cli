import gulp from 'gulp';
import { blue, orange, red } from '../index.js';
export function compileScss(options) {
    const folders = ['typescript'];
    const { sass, outputDir } = options;
    const buildWixScss = () => gulp.src(['typescript/styles/global.scss'], { allowEmpty: true })
        .pipe(sass().on('error', sass.logError))
        .on('error', function (e) {
        console.log("💩" + red.underline.bold(` => Build of SCSS files for ${orange('global.scs')} failed!`));
        console.log("💩" + red.underline.bold(` => Error: ${orange(e.message)}`));
        this.emit('end');
    })
        .pipe(gulp.dest(`${outputDir}/styles`))
        .on('error', function (e) {
        console.log("💩" + red.underline.bold(` => Compiling of scss files for ${orange('global.scs')} failed!`));
        console.log("💩" + red.underline.bold(` => Error: ${orange(e.message)}`));
        this.emit('end');
    })
        .on('end', function () {
        console.log("🐶" + blue.underline(` => Compiling of scss files for ${orange('global.scs')} succeeded!`));
    });
    const buildScss = () => gulp.src(['typescript/public/scss/app.scss'], { allowEmpty: true })
        .pipe(sass().on('error', sass.logError))
        .on('error', function (e) {
        console.log("💩" + red.underline.bold(` => Build of SCSS files for ${orange('app.scss')} failed!`));
        console.log("💩" + red.underline.bold(` => Error: ${orange(e.message)}`));
        this.emit('end');
    })
        .pipe(gulp.dest(`${outputDir}/public/css`))
        .on('error', function (e) {
        console.log("💩" + red.underline.bold(` => Compiling of scss files for ${orange('app.scss')} failed!`));
        console.log("💩" + red.underline.bold(` => Error: ${orange(e.message)}`));
        this.emit('end');
    })
        .on('end', function () {
        console.log("🐶" + blue.underline(` => Compiling of scss files for ${orange('app.scss')} succeeded!`));
    });
    return gulp.parallel(buildWixScss, buildScss);
}

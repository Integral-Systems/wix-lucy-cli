import gulp from 'gulp';
import { blue, red } from '../index.js';
export function compileScss(options) {
    const { sass, outputDir } = options;
    return () => {
        return gulp.src(['typescript/styles/global.scss'])
            .pipe(sass().on('error', sass.logError))
            .pipe(gulp.dest(`${outputDir}/styles`))
            .on('error', function () {
            console.log("💩" + red.underline.bold(' => Compiling of scss files failed!'));
            this.emit('end');
        })
            .on('end', function () {
            console.log("🐶" + blue.underline(' => Compiling of scss files succeeded!'));
        });
    };
}

import gulp from 'gulp';
import { blue, orange, red } from '../index.js';
import gulpJest from 'gulp-jest';
const jest = gulpJest.default;
const taskOpt = {
    continueOnError: true,
};
export function buildPages(options) {
    const { outputDir } = options;
    return () => {
        return gulp.src('typescript/pages/*.ts')
            .pipe(swc(swcOptions))
            .on('error', function (e) {
            console.log("💩" + red.underline.bold(` => Build of Pages files failed!`));
            console.log("💩" + red.underline.bold(` => Error: ${orange(e.message)}`));
            this.emit('end');
        })
            .pipe(gulp.dest(path.join(outputDir, 'pages')))
            .on('error', function (e) {
            console.log("💩" + red.underline.bold(' => Build of Pages TS files failed!'));
            console.log("💩" + red.underline.bold(` => Error: ${orange(e.message)}`));
            this.emit('end');
        })
            .on('end', function () { console.log("🐶" + blue.underline(' => Build of Pages TS files succeeded!')); });
    };
}

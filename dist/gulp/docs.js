import gulp from 'gulp';
import { blue, red } from '../index.js';
import typedoc from 'gulp-typedoc';
export function generateDocs() {
    // path.basename(options.cwd)
    return gulp.src([
        'typescript/backend/**/*.ts',
        'typescript/backend/**/*.tsx',
        '!typescript/backend/**/*.jsw.ts',
        '!typescript/backend/**/*.spec.ts',
    ])
        .pipe(typedoc({
        out: "docs",
        plugins: [
            "typedoc-theme-hierarchy"
        ],
        theme: "hierarchy",
        name: "wix-development"
    }))
        .on('error', function () {
        console.log("💩" + red.underline.bold(' => Build of Backend TS files failed!'));
        this.emit('end');
    })
        .on('end', function () {
        console.log("🐶" + blue.underline(' => Build of Backend TS files succeeded!'));
    });
}

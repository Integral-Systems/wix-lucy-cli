import gulp from 'gulp';
import * as path from 'path';
import swc from 'gulp-swc';
import { logger } from '../../utils/logger.js';
const swcOptions = {
    jsc: {
        target: 'es2020',
        parser: {
            syntax: "typescript",
            tsx: true,
        },
        preserveAllComments: false,
        minify: {
            compress: true // equivalent to {}
        }
    },
};
export function buildPages(options) {
    const { outputDir } = options;
    return () => {
        return gulp.src('typescript/pages/*.ts')
            .pipe(swc(swcOptions))
            .on('error', function (e) {
            logger.error('Build of Pages files failed!');
            logger.error(`Error: ${e.message}`);
            this.emit('end');
        })
            .pipe(gulp.dest(path.join(outputDir, 'pages')))
            .on('error', function (e) {
            logger.error('Build of Pages TS files failed!');
            logger.error(`Error: ${e.message}`);
            this.emit('end');
        })
            .on('end', function () {
            logger.success('Build of Pages TS files succeeded!');
        });
    };
}
//# sourceMappingURL=pages.js.map
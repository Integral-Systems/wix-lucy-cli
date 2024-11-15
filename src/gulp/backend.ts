import gulp from 'gulp';
import { createGulpEsbuild } from 'gulp-esbuild';
import rename from 'gulp-rename';
import * as path from 'path';
import { TaskOptions } from '../Gulpfile';
import { blue, red } from '../index.js';
import ts from 'gulp-typescript';
import merge from 'merge2';
import esbuild from 'gulp-esbuild';
import concat from 'gulp-concat';
import tsConf from '../../files/typescript/tsconfig.json' assert { type: 'json' };


type TsSettings = ts.Settings;
const tsOptions:TsSettings = tsConf.compilerOptions;

export function buildBackend(options: TaskOptions) {
    const { outputDir, enableIncrementalBuild } = options;
    const gulpEsbuild = createGulpEsbuild({
        incremental: enableIncrementalBuild,
    });
    
    return () => {
        return gulp.src([
            'typescript/backend/**/*.ts', 
            'typescript/backend/**/*.tsx', 
            '!typescript/backend/**/*.jsw.ts', 
            '!typescript/backend/**/*.spec.ts',
            '!typescript/backend/http-functions.ts',
        ])
            .pipe(gulpEsbuild({
                bundle: false,
            }))
            .pipe(gulp.dest(path.join(outputDir, 'backend')))
            .on('error', function () {
                console.log("💩" + red.underline.bold(' => Build of Backend TS files failed!'));
                this.emit('end');
            })
            .on('end', function() { console.log("🐶" + blue.underline(' => Build of Backend TS files succeeded!')); 
        }
    )}
}

export function buildBackendLib(options: TaskOptions) {
    const { outputDir, enableIncrementalBuild } = options;
    const gulpEsbuild = createGulpEsbuild({
        incremental: enableIncrementalBuild,
    });
    
    return () => {
        return gulp.src([
            'lib/backend/**/*.ts', 
            'lib/backend/**/*.tsx', 
            '!lib/backend/**/*.jsw.ts', 
            '!lib/backend/**/*.spec.ts',
            '!lib/backend/http-functions.ts',
        ])
            .pipe(gulpEsbuild({
                bundle: false,
            }))
            .pipe(gulp.dest(path.join(outputDir, 'backend')))
            .on('error', function () {
                console.log("💩" + red.underline.bold(' => Build of Backend TS (LIB) files failed!'));
                this.emit('end');
            })
            .on('end', function() { console.log("🐶" + blue.underline(' => Build of Backend TS (LIB) files succeeded!')); 
        }
    )}
}

export function buildBackendJSW(options: TaskOptions) {
    const { outputDir, enableIncrementalBuild } = options;
    const gulpEsbuild = createGulpEsbuild({
        incremental: enableIncrementalBuild,
    });

    return () => {
        return gulp.src(['typescript/backend/**/*.jsw.ts'])
		.pipe(gulpEsbuild({
			bundle: false,
		}))
		.pipe(rename({ extname: '' }))
		.pipe(gulp.dest(path.join(outputDir, 'backend')))
		.on('error', function () {
			console.log("💩" + red.underline.bold(' => Build of JSW files failed!'));
			this.emit('end');
		})
        .on('end', function() { console.log("🐶" + blue.underline(' => Build of (JSW) files succeeded!'))})
    }
}

export function buildBackendJSWLib(options: TaskOptions) {
    const { outputDir, enableIncrementalBuild } = options;
    const gulpEsbuild = createGulpEsbuild({
        incremental: enableIncrementalBuild,
    });

    return () => {
        return gulp.src(['lib/backend/**/*.jsw.ts'])
		.pipe(gulpEsbuild({
			bundle: false,
		}))
		.pipe(rename({ extname: '' }))
		.pipe(gulp.dest(path.join(outputDir, 'backend')))
		.on('error', function () {
			console.log("💩" + red.underline.bold(' => Build of JSW (LIB) files failed!'));
			this.emit('end');
		})
        .on('end', function() { console.log("🐶" + blue.underline(' => Build of JSW (LIB) files succeeded!'))})
    }
}

export function buildBackendHTTP(options: TaskOptions) {
    const { outputDir, enableIncrementalBuild } = options;
    delete tsOptions.outFile;
    delete tsOptions.outDir;
    delete tsOptions.rootDir;
    // tsOptions.resolveJsonModule = false;
    tsOptions.module = 'amd';
    tsOptions.outFile = 'http-functions.js';
console.log({tsOptions})
    return () => {
        return gulp.src(['lib/backend/http-functions.ts', 'typescript/backend/http-functions.ts'])
        .pipe(ts(tsOptions))
        .pipe(gulp.dest(path.join(outputDir, 'backend')))
        .on('error', function () {
			console.log("💩" + red.underline.bold(' => Build of HTTP (LIB) files failed!'));
			this.emit('end');
		})
        .on('end', function() { console.log("🐶" + blue.underline(' => Build of HTTP (LIB) files succeeded!'))})
    };
}
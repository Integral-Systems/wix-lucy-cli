import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import shell from 'gulp-shell';
import * as os from 'os';
import * as dartSass from 'sass';

import backendSettings from '../settings/backend-settings.json' with { type: "json" };;
import masterSettings from '../settings/master-settings.json' with { type: "json" };;
import pageSettings from '../settings/page-settings.json' with { type: "json" };;
import publicSettings from '../settings/public-settings.json' with { type: "json" };;

import { buildPublic } from './gulp/public.js';
import { buildBackend, buildBackendJSW } from './gulp/backend.js';
import { checkPages, checkTs } from './gulp/checks.js';
import { compileScss } from './gulp/styles.js';
import { buildPages } from './gulp/pages.js';
import { previewTemplates } from './gulp/templates.js';
import { copyFiles } from './gulp/copy.js';
import { cleanSrc, cleanWix } from './gulp/clean.js';
import { addTypes, updateWixTypes } from './gulp/types.js';
import { setProdConfig } from './gulp/pipeline.js';
import { watchAll } from './gulp/watchers.js';
import { ModuleSettings, ProjectSettings, blue, green, magenta, orange, red } from './index.js';
import { getModulesSync } from './gulp/helpers.js';

const sass = gulpSass(dartSass);

export type TaskOptions = {
	moduleSettings?: ModuleSettings, 
	projectSettings?: ProjectSettings
	enableIncrementalBuild: boolean;
	outputDir: string;
	sass: ReturnType<typeof gulpSass>;
	userHomeDir: string;
	replaceOptions: typeof replaceOptions;
	backendSettings: typeof backendSettings,
	masterSettings: typeof masterSettings,
	pageSettings: typeof pageSettings,
	publicSettings: typeof publicSettings,
	modulesSync: Record<string, string> | undefined;
	cwd: string;
}

export interface File {
	path: string;
	dirname: string;
	// other properties...
}

const outputDir = './src';
const userHomeDir = os.homedir();
const replaceOptions = {
	logs: {
		enabled: false
	}
};
const taskOptions: TaskOptions = { 
	enableIncrementalBuild: false, 
	outputDir, 
	sass, 
	userHomeDir, 
	pageSettings, 
	publicSettings, 
	backendSettings, 
	masterSettings, 
	replaceOptions,
	cwd: process.cwd(),
	modulesSync: getModulesSync(),
}

gulp.task('check-ts', gulp.parallel( 
	checkTs(taskOptions),
));

gulp.task('scss', gulp.parallel( 
	compileScss(taskOptions),
));

gulp.task('build-backend', gulp.parallel( 
	buildBackend(taskOptions),
	buildBackendJSW(taskOptions),
	// buildBackendHTTP(taskOptions),
));

gulp.task('build-public', gulp.parallel( 
	buildPublic(taskOptions),
));

gulp.task('preview-templates', gulp.parallel(
	previewTemplates(taskOptions),
));

gulp.task('copy-files', gulp.parallel(
	copyFiles(taskOptions),
));

gulp.task('test', function () {
	return shell.task(
		['yarn test'],
		{ ignoreErrors: true }
	)().then(() => {
		console.log("🐕" + blue.underline.bold(' => Exited test task!'));
	}).catch(err => {
		console.log("💩" + red.underline.bold(' => Error in test task!'));
	});
});

gulp.task('sync-types', shell.task([
	'yarn postinstall',
]));

gulp.task('fix-wixtypes', gulp.parallel(
	updateWixTypes(taskOptions)
));

gulp.task('add-wix-types', function(done: gulp.TaskFunctionCallback) {
	return addTypes(taskOptions, done);
});

gulp.task('set-production', gulp.parallel(
	setProdConfig()
));

gulp.task('start-wix', shell.task([
	'yarn wix:dev',
]));

gulp.task('gen-docs', shell.task([
	'yarn docs',
]));

gulp.task('fix-wix', gulp.series(
	cleanWix(),
	'sync-types', 
	'fix-wixtypes', 
	'add-wix-types'
));

gulp.task('build', gulp.parallel(
	'build-backend', 
	'build-public', 
	'preview-templates',
	buildPages(taskOptions),
	compileScss(taskOptions), 
	'copy-files'
	)
);

gulp.task('build-pipeline', gulp.series(
	cleanSrc(taskOptions),
	'set-production',
		// 'check-ts',
	'fix-wixtypes', 
	'add-wix-types',
	// 'test',
	'build',
));

gulp.task('build-prod', gulp.series(
	(done) => checkPages(true, false).then(() => done(), (err) => done(err)),
	cleanSrc(taskOptions),
	'set-production', 
	'fix-wix', 
	// 'check-ts',
	'build-backend', 
	'build-public', 
	buildPages(taskOptions),
	'copy-files',
	compileScss(taskOptions),
	// 'gen-docs'
));


gulp.task('start-dev-env', gulp.parallel(
	watchAll(taskOptions),
	'test',
	'start-wix',
	(done) => checkPages(false, taskOptions.moduleSettings?.force ?? false).then(() => done(), (err) => done(err)),
));

gulp.task('dev', gulp.series(
	cleanSrc(taskOptions),
	'fix-wix',
	// 'check-ts',
	'build',
	// 'start-dev-env', 
	)
);

async function gulpTaskRunner(task: string) {
	return new Promise(function (resolve, reject) {
		gulp.series(task, (done) => {
			resolve(true);
			done();
		})(function (err) {
			if (err) {
				console.log((`💩 ${red.underline.bold("=> Error starting tasks =>")} ${orange(err)}`));
				reject(err);
			}
		});
	});
}

export async function runTask(task: string, moduleSettings: ModuleSettings, projectSettings: ProjectSettings) {
	taskOptions.cwd =  moduleSettings.targetFolder;
	taskOptions.moduleSettings = moduleSettings;
	taskOptions.projectSettings = projectSettings;
	console.log("🐕" + magenta.underline(' => Starting Task => ' +  orange(task)));
	try {
	await gulpTaskRunner(task);
	} catch (err) {
		console.log((`💩 ${red.underline.bold("=> Error starting tasks =>")} ${orange(err)}`));
	}
	console.log("🐶" + green.underline.bold(' => Task completed: ' + task));
}
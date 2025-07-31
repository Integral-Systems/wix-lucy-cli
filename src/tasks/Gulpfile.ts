import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import shell from 'gulp-shell';
import * as os from 'os';
import * as dartSass from 'sass';
import { join } from "path";

import backendSettings from '../../settings/backend-settings.json' with { type: "json" };;
import masterSettings from '../../settings/master-settings.json' with { type: "json" };;
import pageSettings from '../../settings/page-settings.json' with { type: "json" };;
import publicSettings from '../../settings/public-settings.json' with { type: "json" };;

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
import { getModulesSourcePaths } from './gulp/helpers.js';
import { LucySettings } from '../schemas/lucy.js';
import { logger } from '../utils/logger.js';
import { Effect } from 'effect/index';
import { ModuleSettings, ProjectSettings } from '../schemas/gulp.js';
import { LucyConfig } from '../config.js';

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
    // modulesSync: Record<string, string> | undefined;
    modulesSourcePaths: string[];
    cwd: string;
    isWatching?: boolean;
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
export const taskOptions: TaskOptions = { 
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
	// modulesSync: getModulesSync(),
	modulesSourcePaths: [],
}

const watchTaskOptions: TaskOptions = { ...taskOptions, isWatching: true };

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
		logger.success("Tests completed successfully.");
	}).catch(err => {
		logger.error("Error in test task!");
	});
});
gulp.task('test-ci', function () {
	return shell.task(
		['yarn test --run'],
		{ ignoreErrors: true }
	)().then(() => {
		logger.success("Tests completed successfully.");
	}).catch(err => {
		logger.error("Error in test task!");
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
	'check-ts',
	'fix-wixtypes', 
	'add-wix-types',
	'test-ci',
	'build',
));

gulp.task('build-prod', gulp.series(
	(done) => checkPages(true, false).then(() => done(), (err) => done(err)),
	cleanSrc(taskOptions),
	'set-production', 
	'fix-wix', 
	'check-ts',
	'test-ci',
	'build-backend', 
	'build-public', 
	buildPages(taskOptions),
	'copy-files',
	compileScss(taskOptions),
	// 'gen-docs'
));


gulp.task('start-dev-env', gulp.parallel(
	watchAll(watchTaskOptions),
	'test',
	'start-wix',
	'check-ts',
	(done) => checkPages(false, taskOptions.moduleSettings?.force ?? false).then(() => done(), (err) => done(err)),
));

gulp.task('dev', gulp.series(
	cleanSrc(taskOptions),
	'fix-wix',
	'build',
	'start-dev-env', 
	)
);

async function gulpTaskRunner(task: string) {
	return new Promise(function (resolve, reject) {
		gulp.series(task, (done) => {
			resolve(true);
			done();
		})(function (err) {
			if (err) {
				logger.error("Error starting tasks:", err);
				reject(err);
			}
		});
	});
}

export async function runTask(config: LucyConfig) {
	taskOptions.cwd = config.cwd;
	taskOptions.moduleSettings = {
		packageRoot: config.packageRoot,
		targetFolder: config.cwd,
		force: config.force,
		lucyConfigPath: join(config.cwd, "lucy.json"),
		packageJsonPath: join(config.cwd, "package.json"),
		settings: config.lucySettings,
		wixConfigPath: join(config.cwd, "wix.config.json"),
		veloConfigName: join(config.cwd, "jsconfig.json"),
	};
	taskOptions.modulesSourcePaths = getModulesSourcePaths(config);
	taskOptions.projectSettings = {
		modules: config.lucySettings.modules,
        lucySettings: config.lucySettings,
        packageJSON: config.packageJson, 
	};
	const task = config.action.task || "dev";
	logger.action(`Running task: ${task} with options:`, taskOptions);
	try {
	await gulpTaskRunner(task || 'dev');
	} catch (err) {
		logger.error("Error starting tasks:", err);
	}
	logger.report("Task completed successfully:", task);
}
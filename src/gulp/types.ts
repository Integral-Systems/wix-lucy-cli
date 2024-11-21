import gulp from 'gulp';
import * as path from 'path';
import { File, TaskOptions } from '../Gulpfile';
import replace from 'gulp-string-replace';
import foreach from 'gulp-foreach';
import flatmap from 'gulp-flatmap';
import jeditor from 'gulp-json-editor';
import merge from 'merge-stream';
import * as insert from 'gulp-insert';
import { blue, red, yellow } from '../index.js';
import tap from 'gulp-tap';

export function updateWixTypes(options: TaskOptions) {
    return () => {
		const { publicSettings, backendSettings, masterSettings, pageSettings, replaceOptions } = options;
		let count = 0;
		
		const modules: Record<string, string>  = Object.assign({}, options.projectSettings?.modules, options.projectSettings?.lucySettings?.modules);

		let localModules: Record<string, string> | undefined = undefined;
		if(options.projectSettings?.lucySettings) {
			localModules = options.projectSettings.lucySettings.modules as unknown as Record<string, string>;
		}
		// Add module to publicSettings
		publicSettings.compilerOptions.paths.mocks = [ "../../../typescript/__mocks__/*" ] as never;
		publicSettings.compilerOptions.paths['types/*'] = [ "../../../typescript/types/*" ] as never;
		publicSettings.compilerOptions.paths['public/*'] = [ "../../../typescript/public/*.ts" ] as never;
		publicSettings.include = [ "../../../typescript/public/**/*", "../../../typescript/__mocks__/**/*", "../../../typescript/backend/**/*" ] as never;
		// Add module to backendSettings
		backendSettings.compilerOptions.paths.mocks = [ "../../../typescript/__mocks__/*" ] as never;
		backendSettings.compilerOptions.paths['types/*'] = [ `../../../typescript/types/*` ] as never;
		backendSettings.include = [ "../../../typescript/backend/**/*.web.js", "../../../typescript/__mocks__/**/*" ] as never;	
		// Add module to masterSettings
		masterSettings.compilerOptions.paths['types/*'] = [ "../../../typescript/types/*" ] as never;
		masterSettings.include = [ "../../../typescript/public/**/*", "index.d.ts", "../../../typescript/__mocks__/**/*", "../../../typescript/backend/**/*" ] as never;
		// Add module to pageSettings
		pageSettings.compilerOptions.paths['types/*'] = [ "../../../typescript/types/*" ] as never;
		pageSettings.compilerOptions.paths['backend/*'] = [ "../../../typescript/backend/*.jsw.ts" ] as never;
		pageSettings.include = [ "../../../typescript/public/**/*", "../../../typescript/__mocks__/**/*", "../../../typescript/backend/**/*" ] as never;

		if (modules) {
			for (const [name] of Object.entries(modules)) {
				// Add module to publicSettings
				publicSettings.compilerOptions.paths['backend/*.web.js'] = [`../../../${name}/backend/*.web.ts`] as never;
				publicSettings.compilerOptions.paths['backend/*.web'] = [`../../../${name}/backend/*.web.ts`] as never;
				publicSettings.compilerOptions.paths['public/*'].push(`../../../${name}/public/*` as never);
				publicSettings.compilerOptions.paths.mocks.push(...[ `../../../${name}/__mocks__/*` as never ]);
				publicSettings.compilerOptions.paths['types/*'].push(`../../../${name}/types/*` as never);
				publicSettings.include.push(...[`../../../${name}/public/**/*`, `../../../${name}/backend/**/*.web.js`, `../../../${name}__mocks__/**/*`, `../../../${name}/backend/**/*` ] as never[]);
				// Add module to backendSettings
				backendSettings.compilerOptions.paths['public/*'].push(`../../../${name}/public/*` as never);
				backendSettings.compilerOptions.paths['backend/*'].push(`../../../${name}/backend/*` as never);
				backendSettings.compilerOptions.paths.mocks.push(...[ `../../../${name}/__mocks__/*` ] as never[]);
				backendSettings.compilerOptions.paths['types/*'].push(`../../../${name}/types/*` as never);
				backendSettings.include.push(...[`../../../${name}/public/**/*`, `../../../${name}/backend/**/*.web.js`, `../../../${name}__mocks__/**/*`, `../../../${name}/backend/**/*`, `../../../${name}/backend/**/*.web.ts` ] as never[]);
				// Add module to masterSettings
				masterSettings.compilerOptions.paths['backend/*.web.js'] = [`../../../${name}/backend/*.web.ts`] as never;
				masterSettings.compilerOptions.paths['backend/*.web'] = [`../../../${name}/backend/*.web.ts`] as never;
				masterSettings.compilerOptions.paths['public/*'].push(`../../../${name}/public/*` as never);
				masterSettings.compilerOptions.paths['backend/*'].push(`../../../${name}/backend/*` as never);
				masterSettings.compilerOptions.paths['types/*'].push(`../../../${name}/types/*` as never);
				masterSettings.include.push(...[`../../../${name}/public/**/*`, `../../../${name}/backend/**/*.web.js`, `../../../${name}__mocks__/**/*`, `../../../${name}/backend/**/*` ] as never[]);
				// Add module to pageSettings
				pageSettings.compilerOptions.paths['backend/*.web.js'] = [`../../../${name}/backend/*.web.ts`] as never;
				pageSettings.compilerOptions.paths['backend/*.web'] = [`../../../${name}/backend/*.web.ts`] as never;
				pageSettings.compilerOptions.paths['public/*'].push(`../../../${name}/public/*` as never);
				pageSettings.compilerOptions.paths['backend/*'].push(`../../../${name}/backend/*.jsw.ts` as never);
				pageSettings.compilerOptions.paths['types/*'].push(`../../../${name}/types/*` as never);
				pageSettings.include.push(...[`../../../${name}/public/**/*`, `../../../${name}/backend/**/*.web.js`, `../../../${name}__mocks__/**/*`, `../../../${name}/backend/**/*` ] as never[]);
			}
		}

		return gulp.src(['./.wix/types/**/*.json', '!./.wix/types/wix-code-types/*.json'])
		.pipe(flatmap(function(stream: NodeJS.ReadableStream, file: File) {
			count ++;
			if (file.dirname.endsWith('public')) return stream.pipe(jeditor(publicSettings)).pipe(jeditor((json: any) => processJson(json)));
			if (file.dirname.endsWith('backend')) return stream.pipe(jeditor(backendSettings)).pipe(jeditor((json: any) => processJson(json)));
			if (file.dirname.endsWith('masterPage')) return stream.pipe(jeditor(masterSettings)).pipe(jeditor((json: any) => processJson(json)));
			
			return stream.pipe(jeditor(pageSettings)).pipe(jeditor((json: any) => processJson(json)));
		}))
		.pipe(replace('masterPage.masterPage.js', 'masterPage.ts', replaceOptions))
		.pipe(replace('/src/', '/typescript/', replaceOptions))
		.pipe(replace('.js"', '.ts"', replaceOptions))
		.pipe(tap(function(file) { // tap into the stream to log the output
			// console.debug(file.contents?.toString() ?? 'no content'); TODO: Uncomment when needed
		}))
		.pipe(gulp.dest((file: File) => {
			const filePath = file.dirname;
			const outputDir = path.dirname(filePath);
	
			return path.join(outputDir);
		}))
		.on('error', function (e: Error) {
			console.log("💩" + red.underline.bold('Modification of WIX configs failed!'));
			console.error(e);
			this.emit('end');
		})
		.on('end', function() { console.log("🐶" + blue.underline(`Modification of ${yellow(count)} WIX configs succeeded!`)); });	  
    }
}

export function addTypes(options: TaskOptions, done: gulp.TaskFunctionCallback): NodeJS.ReadWriteStream {
	const { replaceOptions } = options;
	const processPages = gulp.src(['./.wix/types/wix-code-types/dist/types/page/$w.d.ts'])
		.pipe(replace('declare namespace \\$w {', ' declare namespace $w{\nconst api: $w.Api;\n', replaceOptions))
		.pipe(gulp.dest('./.wix/types/wix-code-types/dist/types/page/'));

	const exportTypes = gulp.src(['./.wix/types/wix-code-types/dist/types/common/*.d.ts', '!./.wix/types/wix-code-types/dist/types/common/$w.d.ts'])
		.pipe(replace('interface ', 'export interface ', replaceOptions))
		.pipe(replace('enum ', 'export enum ', replaceOptions))
		.pipe(replace('type ', 'export type ', replaceOptions))
		.pipe(gulp.dest('./.wix/types/wix-code-types/dist/types/common/'));

	const exportTypesBeta = gulp.src(['./.wix/types/wix-code-types/dist/types/beta/common/*.d.ts', '!./.wix/types/wix-code-types/dist/types/beta/common/$w.d.ts'])
		.pipe(replace('interface ', 'export interface ', replaceOptions))
		.pipe(replace('enum ', 'export enum ', replaceOptions))
		.pipe(replace('type ', 'export type ', replaceOptions))
		.pipe(gulp.dest('./.wix/types/wix-code-types/dist/types/beta/common/'));

	const processCommon = gulp.src(['./.wix/types/wix-code-types/dist/types/common/$w.d.ts'])
		.pipe(insert.prepend("import { FrontendAPI } from '../../../../../../typescript/public/models/frontendApi.model';\nimport '@total-typescript/ts-reset';\n"))
		.pipe(replace('namespace \\$w {', 'declare namespace $w{\ntype Api = FrontendAPI;\n', replaceOptions))
		.pipe(gulp.dest('./.wix/types/wix-code-types/dist/types/common/'));

	return merge(
		processPages,
		processCommon,
		exportTypesBeta,
		exportTypes,
	)
	.on('error', function(e: Error) {
		console.error(e);
		console.log("💩" + red.underline.bold(' => Updating WIX failed!'));
		this.emit('end');
		done();
	})
	.on('end', function() {
		console.log("🐶" + blue.underline(' => Updating WIX succeeded!'));
		done();
	});
};


function makeHashable(obj: any): any {
	if (Array.isArray(obj)) {
		return obj.map(makeHashable);
	} else if (obj && typeof obj === 'object') {
		const sortedKeys = Object.keys(obj).sort();
		const result: any = {};
		for (const key of sortedKeys) {
			result[key] = makeHashable(obj[key]);
		}
		return result;
	} else {
		return obj;
	}
}

function removeDuplicatesFromArray(arr: any[]): any[] {
	const seen = new Set<string>();
	const newArr: any[] = [];

	for (const item of arr) {
	  	const processedItem = processJson(item); // Recursively process the item
		const hashableItem = makeHashable(processedItem);
		const serializedItem = JSON.stringify(hashableItem);

		if (!seen.has(serializedItem)) {
			seen.add(serializedItem);
			newArr.push(processedItem);
		}
	}  
	return newArr;
}

function processJson(obj: any): any {
	if (Array.isArray(obj)) {
		return removeDuplicatesFromArray(obj);
	} else if (obj && typeof obj === 'object') {
		const result: any = {};
		for (const key in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, key)) {
				result[key] = processJson(obj[key]);
			}
		}
		return result;
	} else {
	  return obj;
	}
}
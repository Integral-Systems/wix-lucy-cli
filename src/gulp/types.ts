import gulp from 'gulp';
import * as path from 'path';
import { File, TaskOptions } from '../Gulpfile';
import replace from 'gulp-string-replace';
import foreach from 'gulp-foreach';
import flatmap from 'gulp-flatmap';
import jeditor from 'gulp-json-editor';
import merge from 'merge-stream';
import * as insert from 'gulp-insert';
import { blue, orange, red, yellow } from '../index.js';
import tap from 'gulp-tap';
import { TSConfig } from '../models';

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
		publicSettings.compilerOptions.paths['backend/*.web'] = [ "../../../typescript/backend/*.web.ts" ] as never;
		publicSettings.compilerOptions.paths['backend/*.web.js'] = [ "../../../typescript/backend/*.web.ts" ] as never;
		publicSettings.compilerOptions.paths['backend/*'] = [ "../../../typescript/backend/*.web.ts" ] as never;
		publicSettings.compilerOptions.paths['backend/*.jsw'] = [ "../../../typescript/backend/*.jsw.ts" ] as never;
		publicSettings.compilerOptions.paths.mocks = [ "../../../typescript/__mocks__/*" ] as never;
		publicSettings.compilerOptions.paths['types/*'] = [ "../../../typescript/types/*" ] as never;
		publicSettings.compilerOptions.paths['public/*'] = [ "../../../typescript/public/*.ts" ] as never;
		publicSettings.include = [ 
			"../../../typescript/public/**/*", 
			"../../../typescript/__mocks__/**/*", 
			// "../../../typescript/backend/**/*.jsw.ts",
			// "../../../typescript/backend/**/*.web.ts",
			// "../../../typescript/backend/**/*.web"
		] as never;

		// Add module to backendSettings
		backendSettings.compilerOptions.paths.mocks = [ "../../../typescript/__mocks__/*" ] as never;
		backendSettings.compilerOptions.paths['types/*'] = [ `../../../typescript/types/*` ] as never;
		backendSettings.include = [ 
			"../../../typescript/backend/**/*", 
			"../../../typescript/__mocks__/**/*",
			// "../../../typescript/backend/**/*.jsw.ts",
			// "../../../typescript/backend/**/*.web.ts",
			// "../../../typescript/backend/**/*.web"
		] as never;	
		// Add module to masterSettings
		masterSettings.compilerOptions.paths['backend/*.web'] = [ "../../../typescript/backend/*.web.ts" ] as never;
		masterSettings.compilerOptions.paths['backend/*.web.js'] = [ "../../../typescript/backend/*.web.ts" ] as never;
		masterSettings.compilerOptions.paths['backend/*'] = [ "../../../typescript/backend/*.web.ts" ] as never;
		masterSettings.compilerOptions.paths['backend/*.jsw'] = [ "../../../typescript/backend/*.jsw.ts" ] as never;
		masterSettings.compilerOptions.paths['types/*'] = [ "../../../typescript/types/*" ] as never;
		masterSettings.include = [ 
			"../../../typescript/public/**/*", 
			"../../../typescript/__mocks__/**/*", 
			// "../../../typescript/backend/**/*.jsw.ts",
			// "../../../typescript/backend/**/*.web.ts",
			// "../../../typescript/backend/**/*.web"
		] as never;
		// Add module to pageSettings
		pageSettings.compilerOptions.paths['backend/*.web'] = [ "../../../typescript/backend/*.web.ts" ] as never;
		pageSettings.compilerOptions.paths['backend/*.web.js'] = [ "../../../typescript/backend/*.web.ts" ] as never;
		pageSettings.compilerOptions.paths['backend/*'] = [ "../../../typescript/backend/*.web.ts" ] as never;
		pageSettings.compilerOptions.paths['backend/*.jsw'] = [ "../../../typescript/backend/*.jsw.ts" ] as never;
		pageSettings.compilerOptions.paths['types/*'] = [ "../../../typescript/types/*" ] as never;
		pageSettings.compilerOptions.paths['backend/*.jsw'] = [ "../../../typescript/backend/*.jsw.ts" ] as never;
		pageSettings.include = [ 
			"../../../typescript/public/**/*", 
			"../../../typescript/__mocks__/**/*", 
			// "../../../typescript/backend/**/*.jsw.ts",
			// "../../../typescript/backend/**/*.web.ts",
			// "../../../typescript/backend/**/*.web"
		] as never;

		if (modules) {
			for (const [name] of Object.entries(modules)) {
				// Add module to publicSettings
				publicSettings.compilerOptions.paths['backend/*.web.js'].push(`../../../${name}/backend/*.web.ts` as never);
				publicSettings.compilerOptions.paths['backend/*.web'].push(`../../../${name}/backend/*.web.ts` as never);
				publicSettings.compilerOptions.paths['backend/*'].push(`../../../${name}/backend/*.web.ts` as never);
				publicSettings.compilerOptions.paths['backend/*.jsw'].push(`../../../${name}/backend/*.jsw.ts` as never);
				publicSettings.compilerOptions.paths['public/*'].push(`../../../${name}/public/*` as never);
				publicSettings.compilerOptions.paths.mocks.push(...[ `../../../${name}/__mocks__/*` as never ]);
				publicSettings.compilerOptions.paths['types/*'].push(`../../../${name}/types/*` as never);
				publicSettings.include.push(...[
					`../../../${name}/public/**/*`, 
					`../../../${name}__mocks__/**/*`, 
					// `../../../${name}/backend/**/*.jsw.ts`,
					// `../../../${name}/backend/**/*.web.ts`,
					// `../../../${name}/backend/**/*.web`
				] as never[]);
				// Add module to backendSettings
				backendSettings.compilerOptions.paths['public/*'].push(`../../../${name}/public/*` as never);
				backendSettings.compilerOptions.paths['backend/*'].push(`../../../${name}/backend/*` as never);
				backendSettings.compilerOptions.paths.mocks.push(...[ `../../../${name}/__mocks__/*` ] as never[]);
				backendSettings.compilerOptions.paths['types/*'].push(`../../../${name}/types/*` as never);
				backendSettings.include.push(...[
					`../../../${name}/public/**/*`, 
					`../../../${name}__mocks__/**/*`, 
					`../../../${name}/backend/**/*`,
					// `../../../${name}/backend/**/*.jsw.ts`,
					// `../../../${name}/backend/**/*.web.ts`,
					// `../../../${name}/backend/**/*.web`
				] as never[]);
				// Add module to masterSettings
				masterSettings.compilerOptions.paths['backend/*.web.js'].push(`../../../${name}/backend/*.web.ts` as never);
				masterSettings.compilerOptions.paths['backend/*.web'].push(`../../../${name}/backend/*.web.ts` as never);
				masterSettings.compilerOptions.paths['backend/*'].push(`../../../${name}/backend/*.web.ts` as never);
				masterSettings.compilerOptions.paths['backend/*.jsw'].push(`../../../${name}/backend/*.jsw.ts` as never);
				masterSettings.compilerOptions.paths['public/*'].push(`../../../${name}/public/*` as never);
				masterSettings.compilerOptions.paths['types/*'].push(`../../../${name}/types/*` as never);
				masterSettings.include.push(...[
					`../../../${name}/public/**/*`, 
					`../../../${name}__mocks__/**/*`, 
					// `../../../${name}/backend/**/*.jsw.ts`,
					// `../../../${name}/backend/**/*.web.ts`,
					// `../../../${name}/backend/**/*.web`
				] as never[]);
				// Add module to pageSettings
				pageSettings.compilerOptions.paths['backend/*.web.js'].push(`../../../${name}/backend/*.web.ts` as never);
				pageSettings.compilerOptions.paths['backend/*.web'].push(`../../../${name}/backend/*.web.ts` as never);
				pageSettings.compilerOptions.paths['backend/*'].push(`../../../${name}/backend/*.web.ts` as never);
				pageSettings.compilerOptions.paths['backend/*.jsw'].push(`../../../${name}/backend/*.jsw.ts` as never);
				pageSettings.compilerOptions.paths['public/*'].push(`../../../${name}/public/*` as never);
				pageSettings.compilerOptions.paths['types/*'].push(`../../../${name}/types/*` as never);
				pageSettings.include.push(...[
					`../../../${name}/public/**/*`, 
					`../../../${name}__mocks__/**/*`, 
					// `../../../${name}/backend/**/*.jsw.ts`,
					// `../../../${name}/backend/**/*.web.ts`,
					// `../../../${name}/backend/**/*.web`
				] as never[]);
			}
		}

		return gulp.src(['./.wix/types/**/*.json', '!./.wix/types/wix-code-types/**/*'])
		.pipe(flatmap(function(stream: NodeJS.ReadableStream, file: File) {
			count ++;
			if (file.dirname.endsWith('public')) {
				return stream.pipe(jeditor(publicSettings))
					.pipe(jeditor((json: any) => cleanTsConfig(json)))
					.pipe(jeditor((json: any) => processJson(json)))
					.pipe(replace('"../backend.d.ts",', '', replaceOptions))
					.pipe(replace('"../../../src/backend/\\*\\*/\\*.web.js",', '', replaceOptions));
			}
			if (file.dirname.endsWith('backend')) {
				return stream.pipe(jeditor(backendSettings))
					.pipe(jeditor((json: any) => cleanTsConfig(json)))
					.pipe(jeditor((json: any) => processJson(json)))
			};
			if (file.dirname.endsWith('masterPage')) {
				return stream.pipe(jeditor(masterSettings))
					.pipe(jeditor((json: any) => cleanTsConfig(json)))
					.pipe(jeditor((json: any) => processJson(json)))
					.pipe(replace('"../backend.d.ts",', '', replaceOptions))
					.pipe(replace('"../../../src/backend/\\*\\*/\\*.web.js",', '', replaceOptions));
			};
			
			return stream.pipe(jeditor(pageSettings))
				.pipe(jeditor((json: any) => cleanTsConfig(json)))
				.pipe(jeditor((json: any) => processJson(json)))
				.pipe(replace('"../backend.d.ts",', '', replaceOptions))
				.pipe(replace('"../../../src/backend/\\*\\*/\\*.web.js",', '', replaceOptions));
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
			console.log("💩" + red.underline.bold(` => Error: ${orange(e.message)}`));
			this.emit('end');
		})
		.on('end', function() { console.log("🐶" + blue.underline(`Modification of ${yellow(count)} WIX configs succeeded!`)); });	  
    }
}

export function addTypes(options: TaskOptions, done: gulp.TaskFunctionCallback): NodeJS.ReadWriteStream {
    const { replaceOptions } = options;

    // Regex to match keywords at the beginning of a line, capturing any leading whitespace.
    // The 'm' flag is for multiline matching (^ matches start of line).
    // The 'g' flag is for global matching (replace all instances).
    const interfaceRegex = /^(\s*)interface\s/gm;
    const enumRegex = /^(\s*)enum\s/gm;
    const typeRegex = /^(\s*)type\s/gm;

    const exportTypes = gulp.src(['./.wix/types/wix-code-types/dist/types/common/*.d.ts', '!./.wix/types/wix-code-types/dist/types/common/$w.d.ts'])
        // The replacement string '$1export...' uses the captured whitespace to preserve indentation.
        .pipe(replace(interfaceRegex, 'export interface ', replaceOptions))
        .pipe(replace(enumRegex, 'export enum ', replaceOptions))
        .pipe(replace(typeRegex, 'export type ', replaceOptions))
        .pipe(gulp.dest('./.wix/types/wix-code-types/dist/types/common/'));

    const exportTypesBeta = gulp.src(['./.wix/types/wix-code-types/dist/types/beta/common/*.d.ts', '!./.wix/types/wix-code-types/dist/types/beta/common/$w.d.ts'])
        .pipe(replace(interfaceRegex, '$1export interface ', replaceOptions))
        .pipe(replace(enumRegex, 'export enum ', replaceOptions))
        .pipe(replace(typeRegex, 'export type ', replaceOptions))
        .pipe(gulp.dest('./.wix/types/wix-code-types/dist/types/beta/common/'));

    const processCommon = gulp.src(['./.wix/types/wix-code-types/dist/types/common/$w.d.ts'])
        .pipe(insert.prepend("import '@total-typescript/ts-reset';\n"))
        .pipe(gulp.dest('./.wix/types/wix-code-types/dist/types/common/'));

    return merge(
        processCommon,
        exportTypesBeta,
        exportTypes,
    )
    .on('error', function(e: Error) {
        console.log("💩" + red.underline.bold(' => Updating WIX failed!'));
        console.log("💩" + red.underline.bold(` => Error: ${orange(e.message)}`));
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
        // Process arrays and remove duplicate items
        const uniqueArray = removeDuplicatesFromArray(obj);
        return uniqueArray.length > 0 ? uniqueArray : undefined; // Remove empty arrays
    } else if (obj && typeof obj === 'object') {
        // Process objects, ensuring keys are unique
        const result: any = {};
        const seenKeys = new Set<string>();

        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                if (!seenKeys.has(key)) {
                    const processedValue = processJson(obj[key]);
                    if (processedValue !== undefined) { // Remove keys with undefined values
                        seenKeys.add(key);
                        result[key] = processedValue;
                    }
                }
            }
        }

        // If all keys were empty or undefined, return undefined
        return Object.keys(result).length > 0 ? result : undefined;
    } else {
        // Return primitive values as-is
        return obj;
    }
}

function cleanTsConfig(json: TSConfig): TSConfig {
	// const paths: Record<string, string[]> = {};
	if (json.compilerOptions?.paths) {
		for (const [key, value] of Object.entries(json.compilerOptions.paths)) {
			const uniquePaths = new Set(value);
			json.compilerOptions.paths[key] = Array.from(uniquePaths);
			// paths[key] = Array.from(uniquePaths);
		}
		// json.compilerOptions.paths = paths;
	}
	json.include = Array.from(new Set(json.include));
	json.exclude = Array.from(new Set(json.exclude));
	json.files = Array.from(new Set(json.files));

	return json;
}
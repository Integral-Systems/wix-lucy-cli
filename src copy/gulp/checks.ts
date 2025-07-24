import * as fs from 'fs';
import glob from 'glob';

import * as path from 'path';
import typescript from 'typescript';
import gulp from 'gulp';
import ts from 'gulp-typescript';
import { blue, green, magenta, orange, red, yellow } from '../index.js';
import { TaskOptions } from '../Gulpfile.js';

// /**
//  *  Extracts a match from a file
//  * @param {string} filePath File path
//  * @param {string} pattern Pattern to match
//  */
// function extractMatchFromFile(filePath: string, pattern: string) {
// 	return new Promise((resolve, reject) => {
// 		fs.readFile(filePath, 'utf8', (err, data) => {
// 			if (err){
// 				reject(err);
				
// 				return;
// 			}
// 			const regex = new RegExp(pattern);
// 			const match = regex.exec(data);
// 			const capturedGroup = match ? match.groups?.page : null;
// 			resolve(capturedGroup);
// 		});
// 	});
// }

// async function readFilesInFolder(folderPath: string, pattern: string | null, globPattern: string): Promise<Object[]> {
//     const files = await glob(path.join(folderPath, globPattern));
//     const filenameList: Object[] = [];

//     for (const file of files) {
//         if (pattern) {
//             const capturedGroup = await extractMatchFromFile(file, pattern);
//             if (capturedGroup) {
//                 filenameList.push(capturedGroup);
//             }
//         } else {
//             filenameList.push(path.basename(file));
//         }
//     }

//     return filenameList;
// }

/**
 *  Extracts a match from a file
 * @param {string} filePath File path
 * @param {string} pattern Pattern to match
 */
function extractMatchFromFile(filePath: string, pattern: string) {
	return new Promise((resolve, reject) => {
		fs.readFile(filePath, 'utf8', (err, data) => {
			if (err){
				reject(err);
				
				return;
			}
			const regex = new RegExp(pattern);
			const match = regex.exec(data);
			const capturedGroup = match ? match.groups?.page : null;
			resolve(capturedGroup);
		});
	});
}

/**
 * Reads files in a folder
 * @param {string} folderPath Folder path
 * @param {string} pattern Pattern to match
 * @param {string} globPattern Glob pattern
 */
function readFilesInFolder(folderPath: string, pattern: string | null, globPattern: string,) {
	return new Promise((resolve, reject) => {
		glob(path.join(folderPath, globPattern), (err: unknown, files: string[]) => {
			if (err){
				reject(err);

				return;
			}  
			const filenameList: Object[] = [];
			/**
			 * Traverse files
			 * @param {number} index Index
			 */
			function traverseFiles(index: number) {
				if (index === files.length){
					resolve(filenameList);
					
					return;
				}
				const file = files[index];
				if(pattern){
					if(!file) return
					extractMatchFromFile(file, pattern)
						.then((capturedGroup) => {
							if (capturedGroup){
								filenameList.push(capturedGroup);
							}
							traverseFiles(index + 1);
						})
						.catch(reject);
				}
				if(!pattern){
					if(!file) return
					filenameList.push(path.basename(file));
					traverseFiles(index + 1);
				}
			}
			traverseFiles(0);
		});
	});
}
export async function checkPages(fail: boolean, force: boolean) {
	console.log("🐕" + green.underline.bold(' => Checking pages...'));
	return new Promise<void>(async (resolve, reject) => {
		try {
			const sourcePages = await readFilesInFolder('./.wix/types/', '\\/pages\\/(?<page>.*\\.ts)', '**/*.json',) as string[];
			const tsPages = await readFilesInFolder('./typescript/pages', null, '**/*.ts',) as string[];

			const sourcePagesSet = new Set(sourcePages);
			const tsPagesSet = new Set(tsPages);
			const missingInTs = Array.from(sourcePagesSet).filter((item: string) => !tsPages.includes(item));
			const obsoleteInTs = Array.from(tsPagesSet).filter((item: string) => !sourcePages.includes(item));
			if (missingInTs.length > 0){
				if(!force){
					console.log("💩" + red.underline.bold(' => Missing pages in ts folder: '), '\n', missingInTs);
				}
				if(force) {
					for (const page of missingInTs) {
						console.log("🐶" + magenta.underline.bold(' => Creating missing page: '), page);
						fs.writeFileSync(`./typescript/pages/${page}`, '');
					}
				}
			}
			if (obsoleteInTs.length > 0){
				if(!force){
					console.log("🦴" + yellow.underline.bold(' => Obsolete in ts folder'), '\n', obsoleteInTs);
				}
				if(force) {
					for (const page of obsoleteInTs) {
						console.log("🐶" + magenta.underline.bold(' => Deleting obsolete page: '), page);
						fs.rmSync(`./typescript/pages/${page}`);
					}
				}
			}
			if (missingInTs.length === 0 && obsoleteInTs.length === 0) {
				console.log("🐶" + blue.underline.bold(' => Pages are in-sync!'))
			} else if(fail){
				process.exit(1);
			};
		} catch (error) {
		reject(error);
		}
	});
}

const customReporter: ts.reporter.Reporter = {
	error: (error, tsInstance) => {
		if (!error.diagnostic) {
			console.log(red(error.message));
			return;
		}
		const { fullFilename, startPosition } = error;
		const relativePath = path.relative(process.cwd(), fullFilename ?? '');
		const line = startPosition ? startPosition.line + 1 : 0;
		const col = startPosition ? startPosition.character + 1 : 0;

		const message = tsInstance.flattenDiagnosticMessageText(error.diagnostic.messageText, '\n');

		console.log(
			`${blue.underline(relativePath)}:${yellow(String(line))}:${yellow(String(col))}`
		);
		console.log(`  ${red('error')} ${yellow(`TS${error.diagnostic.code}`)}: ${message}`);
	},
	finish: (results) => {
		const errorCount = results.transpileErrors + results.semanticErrors + results.declarationErrors;
		if (errorCount > 0) {
			console.log(`\n💥 ${red.bold(`Found ${errorCount} error${errorCount > 1 ? 's' : ''}.`)}`);
		}
	},
};

export function checkTs(options: TaskOptions) {
    const folders = ['typescript', ...options.modulesSourcePaths];


    // Create tasks for each folder
    const tasks = folders.map((folder) => {
		const tsProject = ts.createProject(`./local.tsconfig.json`, { noEmit: true, declaration: false, skipDefaultLibCheck: true });

        const taskName = `test-${folder}`; // Create a unique name for each task

        const task = () => {
            let hasError = false;
            const stream = gulp.src([`${folder}/**/*.ts`, `!${folder}/types/**/*.ts`])
                .pipe(tsProject(customReporter))
                .on('error', () => {
                    hasError = true;
                });

            if (options.isWatching) {
                stream.on('error', function (this: NodeJS.ReadWriteStream) {
                    this.emit('end');
                });
            }

            stream.on('end', () => {
                if (!hasError) {
                    console.log("🐶" + blue.underline(` => Typescriptcheck for ${orange(folder)} succeeded!`));
                }
            });

            return stream;
        };

        // Register the task with Gulp
        Object.defineProperty(task, 'name', { value: taskName }); // Set a unique name for debugging
        return task;
    });

    // Run all tasks in parallel
    return gulp.parallel(...tasks);
}
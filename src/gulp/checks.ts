import * as fs from 'fs';
import glob from 'glob';
import * as path from 'path';
import gulp from 'gulp';
import ts from 'gulp-typescript';
import { blue, green, magenta, red, yellow } from '../index.js';

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

export function checkTs() {
    const tsProject = ts.createProject('./lib/tsconfig.json', { noEmit: true });
    return () => {
        return 	gulp.src(['lib/typescript/**/*.ts', '!lib/typescript/types/**/*.ts'], { cwd: 'typescript' })
        .pipe(tsProject(ts.reporter.fullReporter()))
        .on('error', function () {
            console.log("💩" + red.underline.bold(' => Typescript error!'));
            this.emit('end');
        })
        .on('end', function () {
            console.log("🐶" + blue.underline(' => Typescriptcheck succeeded!'));
        });
    };
}

export function checkTsLib() {
    const tsProject = ts.createProject('./lib/tsconfig.json', { noEmit: true });

    return () => {
        return 	gulp.src(['lib/typescript/**/*.ts', '!lib/typescript/types/**/*.ts'], { cwd: 'typescript' })
        .pipe(tsProject(ts.reporter.fullReporter()))
        .on('error', function () {
            console.log("💩" + red.underline.bold(' => Typescript (LIB) error!'));
            this.emit('end');
        })
        .on('end', function () {
            console.log("🐶" + blue.underline(' => Typescript check (LIB) succeeded!'));
        });
    };
}
import * as fs from 'fs';
import { glob } from 'glob';
import * as path from 'path';
import gulp from 'gulp';
import ts from 'gulp-typescript';
import { blue, logger, red, yellow } from '../../utils/logger.js';
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
function extractMatchFromFile(filePath, pattern) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
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
async function readFilesInFolder(folderPath, pattern, globPattern) {
    const files = await glob.glob(path.join(folderPath, globPattern));
    const filenameList = [];
    function traverseFiles(index) {
        if (index === files.length) {
            return;
        }
        const file = files[index];
        if (pattern) {
            if (!file)
                return;
            extractMatchFromFile(file, pattern)
                .then((capturedGroup) => {
                if (capturedGroup) {
                    filenameList.push(capturedGroup);
                }
                traverseFiles(index + 1);
            })
                .catch(() => { throw new Error(`Error reading file: ${file}`); });
        }
        if (!pattern) {
            if (!file)
                return;
            filenameList.push(path.basename(file));
            traverseFiles(index + 1);
        }
    }
    traverseFiles(0);
    return filenameList;
}
export async function checkPages(fail, force) {
    logger.action('Checking pages...');
    return new Promise(async (resolve, reject) => {
        try {
            const sourcePages = await readFilesInFolder('./.wix/types/', '\\/pages\\/(?<page>.*\\.ts)', '**/*.json');
            const tsPages = await readFilesInFolder('./typescript/pages', null, '**/*.ts');
            const sourcePagesSet = new Set(sourcePages);
            const tsPagesSet = new Set(tsPages);
            const missingInTs = Array.from(sourcePagesSet).filter((item) => !tsPages.includes(item));
            const obsoleteInTs = Array.from(tsPagesSet).filter((item) => !sourcePages.includes(item));
            if (missingInTs.length > 0) {
                if (!force) {
                    logger.error('Missing pages in ts folder:', '\n', missingInTs);
                }
                if (force) {
                    for (const page of missingInTs) {
                        logger.action('Creating missing page: ', page);
                        fs.writeFileSync(`./typescript/pages/${page}`, '');
                    }
                }
            }
            if (obsoleteInTs.length > 0) {
                if (!force) {
                    const formattedList = obsoleteInTs.map(page => `  • ${page}`).join('\n');
                    logger.error('Obsolete pages in TS folder:\n' + yellow(formattedList));
                }
                if (force) {
                    for (const page of obsoleteInTs) {
                        logger.action('Deleting obsolete page: ', page);
                        fs.rmSync(`./typescript/pages/${page}`);
                    }
                }
            }
            if (missingInTs.length === 0 && obsoleteInTs.length === 0) {
                logger.info("All pages are in-sync!");
            }
            else if (fail) {
                process.exit(1);
            }
            ;
        }
        catch (error) {
            reject(error);
        }
    });
}
const customReporter = {
    error: (error, tsInstance) => {
        if (!error.diagnostic) {
            logger.error(error.message);
            return;
        }
        const { fullFilename, startPosition } = error;
        const relativePath = path.relative(process.cwd(), fullFilename ?? '');
        const line = startPosition ? startPosition.line + 1 : 0;
        const col = startPosition ? startPosition.character + 1 : 0;
        const message = tsInstance.flattenDiagnosticMessageText(error.diagnostic.messageText, '\n');
        logger.info(`${blue.underline(relativePath)}:${yellow(String(line))}:${yellow(String(col))}`);
        logger.error(`  ${red('error')} ${yellow(`TS${error.diagnostic.code}`)}: ${message}`);
    },
    finish: (results) => {
        const errorCount = results.transpileErrors + results.semanticErrors + results.declarationErrors;
        if (errorCount > 0) {
            logger.error(`\n${red.bold(`Found ${errorCount} error${errorCount > 1 ? 's' : ''}.`)}`);
        }
    },
};
export function checkTs(options) {
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
                stream.on('error', function () {
                    this.emit('end');
                });
            }
            stream.on('end', () => {
                if (!hasError) {
                    logger.success(`Typescript check for ${folder} succeeded!`);
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
//# sourceMappingURL=checks.js.map
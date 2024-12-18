import * as fs from 'fs';
import globPkg from 'glob';
import * as path from 'path';
import gulp from 'gulp';
import ts from 'gulp-typescript';
import { blue, green, magenta, orange, red, yellow } from '../index.js';
const { glob } = globPkg;
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
async function readFilesInFolder(folderPath, pattern, globPattern) {
    const files = await glob(path.join(folderPath, globPattern));
    const filenameList = [];
    for (const file of files) {
        if (pattern) {
            const capturedGroup = await extractMatchFromFile(file, pattern);
            if (capturedGroup) {
                filenameList.push(capturedGroup);
            }
        }
        else {
            filenameList.push(path.basename(file));
        }
    }
    return filenameList;
}
export async function checkPages(fail, force) {
    console.log("🐕" + green.underline.bold(' => Checking pages...'));
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
                    console.log("💩" + red.underline.bold(' => Missing pages in ts folder: '), '\n', missingInTs);
                }
                if (force) {
                    for (const page of missingInTs) {
                        console.log("🐶" + magenta.underline.bold(' => Creating missing page: '), page);
                        fs.writeFileSync(`./typescript/pages/${page}`, '');
                    }
                }
            }
            if (obsoleteInTs.length > 0) {
                if (!force) {
                    console.log("🦴" + yellow.underline.bold(' => Obsolete in ts folder'), '\n', obsoleteInTs);
                }
                if (force) {
                    for (const page of obsoleteInTs) {
                        console.log("🐶" + magenta.underline.bold(' => Deleting obsolete page: '), page);
                        fs.rmSync(`./typescript/pages/${page}`);
                    }
                }
            }
            if (missingInTs.length === 0 && obsoleteInTs.length === 0) {
                console.log("🐶" + blue.underline.bold(' => Pages are in-sync!'));
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
export function checkTs(options) {
    const folders = ['typescript'];
    if (options.modulesSync) {
        for (const module of Object.keys(options.modulesSync)) {
            folders.push(module);
        }
    }
    // Create tasks for each folder
    const tasks = folders.map((folder) => {
        const tsProject = ts.createProject(`./${folder}/tsconfig.json`, { noEmit: true });
        const taskName = `test-${folder}`; // Create a unique name for each task
        const task = () => gulp.src([`${folder}/**/*.ts`, `!${folder}/types/**/*.ts`], { cwd: folder })
            .pipe(tsProject(ts.reporter.fullReporter(true)))
            .on('error', function (e) {
            console.log("💩" + red.underline.bold(` => Typescriptcheck for ${orange(folder)} failed!`));
            console.log("💩" + red.underline.bold(` => Error: ${orange(e.message)}`));
            this.emit('end');
        })
            .on('end', function () {
            console.log("🐶" + blue.underline(` => Typescriptcheck for ${orange(folder)} succeeded!`));
        });
        // Register the task with Gulp
        Object.defineProperty(task, 'name', { value: taskName }); // Set a unique name for debugging
        return task;
    });
    // Run all tasks in parallel
    return gulp.parallel(...tasks);
}

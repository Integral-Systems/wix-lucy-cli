// import chalk from 'chalk';
// import { existsSync, mkdirSync, promises as fsPromises } from 'fs';
// import fse from 'fs-extra';
// import { join } from 'path';
// import fs from 'fs/promises';
// import path from 'path';
// import os from 'os';
// import enquirer from 'enquirer';
// import { ModuleSettings, ProjectSettings, blue, green, orange, red } from './index.js';
// import { createTemplateFolder, gitInit, installPackages } from './helpers.js';

import { Effect, Schema } from "effect/index"
import { Config } from "../config.js";
import { init_expo } from "./expo.js";
import { selectTemplate } from "./templates.js";
import Enquirer from "enquirer";
import { AppError } from "../error.js";
import { createLucyHome } from "../commands/home.js";
import { readLucyJsonFromTemplate } from "../commands/read.js";

// const { Select } = enquirer as any;
// /**
//  * Init Lucy project
//  * @param {string} cwd Current working directory
//  * @param {string} packageRoot Package root directory
//  * @returns {void}
//  */
// export async function init(moduleSettings: ModuleSettings, projectSettings: ProjectSettings) {
    
// 	if(projectSettings.packageJSON && projectSettings.packageJSON.wixLucy?.initialized && !moduleSettings.args.includes('-f')) {
// 		console.log((`💩 ${red.underline.bold("=> This project is already initialized =>")} ${orange(moduleSettings.targetFolder)}`));
// 		return;
// 	}

// 	const templatesPath = join(os.homedir(), '.lucy-cli');
//     if (!existsSync(templatesPath)) {
//         console.log(chalk.yellow(`Templates folder not found at ${orange(templatesPath)}. Creating it with a default template...`));
// 		await createTemplateFolder(moduleSettings);
//     }

//     const templateChoices = (await fs.readdir(templatesPath, { withFileTypes: true }))
//         .filter(dirent => dirent.isDirectory())
//         .map(dirent => dirent.name);

//     if (templateChoices.length === 0) {
//         console.log((`💩 ${red.underline.bold("=> No templates found in =>")} ${orange(templatesPath)}`));
//         return;
//     }

//     const prompt = new Select({
//         name: 'template',
//         message: 'Select a project template',
//         choices: templateChoices
//     });

//     const selectedTemplate = await prompt.run();
//     const templateDir = join(templatesPath, selectedTemplate);
//     const templateFilesDir = join(templateDir, 'files');
//     const templateSettingsPath = join(templateDir, 'settings.json');

//     if (!existsSync(templateSettingsPath)) {
//         console.log((`💩 ${red.underline.bold("=> Template is missing settings.json at =>")} ${orange(templateSettingsPath)}`));
//         return;
//     }

//     try {
//         const templateSettingsRaw = await fs.readFile(templateSettingsPath, 'utf8');
//         moduleSettings.settings = JSON.parse(templateSettingsRaw);
//     } catch (e) {
//         console.log((`💩 ${red.underline.bold("=> Error reading or parsing template settings =>")} ${orange(e)}`));
//         return;
//     }

// 	await copyFolder(templateFilesDir, moduleSettings.targetFolder);

// 	await editJson(moduleSettings.packageJsonPath, ['type', 'scripts'], ['module', moduleSettings.settings.scripts ]);
// 	await stringReplace(join(moduleSettings.targetFolder, 'currents.config.js'), ['__ProjectName__'], [path.basename(moduleSettings.targetFolder)]);

// 	await installPackages(moduleSettings.settings.wixPackages, moduleSettings.settings.devPackages, moduleSettings.targetFolder, moduleSettings.lockVersion);

// 	await editJson(join(moduleSettings.targetFolder, 'jsconfig.json'), ['compilerOptions', 'exclude'], [moduleSettings.settings.wixSettings.compilerOptions, moduleSettings.settings.wixSettings.exclude]);
// 	await editJson(join(moduleSettings.targetFolder, 'typedoc.json'), ['name'], [path.basename(moduleSettings.targetFolder)]);

// 	await gitInit(moduleSettings.targetFolder, moduleSettings.settings.modules, moduleSettings.force);

// 	moduleSettings.settings.initialized = true;

// 	const eslintrcPath = join(moduleSettings.targetFolder, '.eslintrc.json');
// 	if(existsSync(eslintrcPath)) {
// 		console.log((`🐕 ${blue.underline.bold("=> Deleting .eslintrc.json")}`));
// 		await fs.rm(join(eslintrcPath), { recursive: false }).catch(e => {
// 			console.log((`💩 ${red.underline.bold("=> Could not delete .eslintrc.json ")} ${red.bold("=> ", e)}`));
// 		});
// 	}

// 	console.log((`🐕 ${blue.underline.bold("=> Writing settings to lucy.json")}`));
// 	await fs.writeFile(join(moduleSettings.targetFolder, 'lucy.json'), JSON.stringify(moduleSettings.settings, null, 2));

// 	console.log(chalk.greenBright.underline('🐶 => Initialization done!'));
// }

// /**
//  * Copy files from source to target
//  * @param {string} source Source folder
//  * @param {string} target Target folder
//  * @returns {Promise<void>}
//  */
// async function copyFolder(source: string, target: string): Promise<void> {
// 	if (!existsSync(target)){
// 		console.log((`💩 ${red.underline.bold("=> Target folder doesn't exist =>")} ${orange(target)}`));
// 		return;
// 	}

// 	try {
// 		const files = await fsPromises.readdir(source);
// 		for (const file of files){
// 			const sourcePath = join(source, file);
// 			const targetPath = join(target, file);

// 			if (file === 'lucy.json' && existsSync(targetPath)){
// 				continue;
// 			}
// 			const stats = await fsPromises.stat(sourcePath);
// 			if (stats.isDirectory()){
// 				if (!existsSync(file)){
// 					mkdirSync(file);
// 				}
// 				await fse.copySync(sourcePath, targetPath, { overwrite: true });
// 			} else {
// 				fse.copySync(sourcePath, targetPath, { overwrite: true });
// 			}
// 		}
// 	} catch (err){
// 		console.log((`💩 ${red.underline.bold("=> There was an error while copying files =>")} ${orange(err)}`));
// 	} finally {
// 		console.log("🐕" + blue.underline.bold(' => Copy files completed!'));
// 	}
// }

// /**
//  * Edit Json files
//  * @param {string} filePath File path
//  * @param {string[]} keys Keys to edit
//  * @param {string[]} values Values to edit
//  * @returns {void}
//  */
// async function editJson(filePath: string, keys: string[], values: string[] | Object[] ) {
// 	try {
// 		const data = await fs.readFile(filePath, 'utf8');

// 		let jsonData;
// 		try {
// 			jsonData = JSON.parse(data);
// 		} catch (parseError) {
// 			console.log((`💩 ${red.underline.bold("=> Error parsing JSON =>")} ${orange(parseError)}`));
// 			return;
// 		}

// 		for (const key of keys){
// 			const index = keys.indexOf(key);
// 			const value = values[index];
// 			jsonData[key] = value;
// 		}

// 		const updatedJsonData = JSON.stringify(jsonData, null, 2);
// 		await fs.writeFile(filePath, updatedJsonData, 'utf8');
// 	} catch (err) {
// 		console.log((`💩 ${red.underline.bold("=> Error editing JSON Data =>")} ${orange(err)}`));
// 	} finally {
// 		console.log("🐕" + blue.underline(` => Updated file ${orange(filePath)}`));
// 	}
// }

// async function stringReplace(filePath: string, keys: string[], values: string[]) {
// 	try {
// 		let modifiedContent: string = '';
// 		const data = await fs.readFile(filePath, 'utf8');

// 		for (const key of keys){
// 			const index = keys.indexOf(key);
// 			const value = values[index];
// 			const regex = new RegExp(`${key}`, 'g');
// 			modifiedContent = data.replace(regex, `${value}`);
// 		}

// 		await fs.writeFile(filePath, modifiedContent, 'utf8');
// 	} catch (err) {
// 		console.log((`💩 ${red.underline.bold("=> During string replace =>")} ${orange(err)}`));
// 	} finally {
// 		console.log(blue.underline(`🐕 => Updated file ${orange(filePath)}`));
// 	}
// }

export const init = () => {
    return Effect.gen(function* (_) {
        const config = yield* Config;
        if(config.config.action.type === undefined) {
            return yield* Effect.fail("No Params Provided");
        }
        yield* createLucyHome();
        const projectName = config.config.cwd.split('/').pop() || 'expo-project';

        const templateQuestion = new Enquirer();
        const choice = yield* Effect.tryPromise({
            try: () => templateQuestion.prompt({
                type: 'input',
                name: 'projectName',
                message: 'Enter a project name',
                initial: projectName,
                validate: (value: string) => value.trim() !== '' ? true : 'Project name cannot be empty'
            }),
            catch: (e) => {
                return new AppError({ cause: e, message: 'Error selecting template' });
            }
        })
        const selectedName = yield* Schema.decodeUnknown(Schema.Struct({ projectName: Schema.String }))(choice)
        config.config.projectName = selectedName.projectName.trim();

        yield* selectTemplate();
        yield* readLucyJsonFromTemplate;

        if(config.config.action.type === 'expo') {
            return yield* init_expo();
        }

    })
}
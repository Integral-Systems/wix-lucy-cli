import chalk from 'chalk';
import { existsSync, mkdirSync, promises as fsPromises } from 'fs';
import fse from 'fs-extra';
import { join } from 'path';
import { simpleGit } from 'simple-git';
import fs from 'fs/promises';
import { spawnSync } from 'child_process';
import path from 'path';
import { ModuleSettings, ProjectSettings, blue, green, orange, red } from './index.js';
import { gitInit, installPackages } from './helpers.js';

/**
 * Init Lucy project
 * @param {string} cwd Current working directory
 * @param {string} packageRoot Package root directory
 * @returns {void}
 */
export async function init(moduleSettings: ModuleSettings, projectSettings: ProjectSettings) {
	
	if(projectSettings.packageJSON && projectSettings.packageJSON.wixLucy?.initialized && !moduleSettings.args.includes('-f')) {
		console.log((`💩 ${red.underline.bold("=> This project is already initialized =>")} ${orange(moduleSettings.targetFolder)}`));
		return;
	}

	await copyFolder(join(moduleSettings.packageRoot, 'files'), moduleSettings.targetFolder);

	await editJson(moduleSettings.packageJsonPath, ['type', 'scripts'], ['module', moduleSettings.settings.scripts ]);
	await stringReplace(join(moduleSettings.targetFolder, 'currents.config.js'), ['__ProjectName__'], [path.basename(moduleSettings.targetFolder)]);

	await installPackages(moduleSettings.settings.wixPackages, moduleSettings.settings.devPackages, moduleSettings.targetFolder, moduleSettings.lockVersion);

	await editJson(join(moduleSettings.targetFolder, 'jsconfig.json'), ['compilerOptions', 'exclude'], [moduleSettings.settings.wixSettings.compilerOptions, moduleSettings.settings.wixSettings.exclude]);
	await editJson(join(moduleSettings.targetFolder, 'typedoc.json'), ['name'], [path.basename(moduleSettings.targetFolder)]);

	await gitInit(moduleSettings.targetFolder, moduleSettings.settings.modules);

	moduleSettings.settings.initialized = true;

	fs.rm(join(moduleSettings.targetFolder, '.eslintrc.json'), { recursive: false });
	fs.writeFile(join(moduleSettings.targetFolder, 'lucy.json'), JSON.stringify(moduleSettings.settings, null, 2));

	console.log(chalk.greenBright.underline('🐶 => Initialization done!'));
}

/**
 * Copy files from source to target
 * @param {string} source Source folder
 * @param {string} target Target folder
 * @returns {Promise<void>}
 */
async function copyFolder(source: string, target: string): Promise<void> {
	if (!existsSync(target)){
		console.log((`💩 ${red.underline.bold("=> Target folder doesn't exist =>")} ${orange(target)}`));
		return;
	}

	try {
		const files = await fsPromises.readdir(source);
		for (const file of files){
			const sourcePath = join(source, file);
			const targetPath = join(target, file);

			if (file === 'lucy.json' && existsSync(targetPath)){
				continue;
			}
			const stats = await fsPromises.stat(sourcePath);
			if (stats.isDirectory()){
				if (!existsSync(file)){
					mkdirSync(file);
				}
				await fse.copySync(sourcePath, targetPath, { overwrite: true });
			} else {
				fse.copySync(sourcePath, targetPath, { overwrite: true });
			}
		}
	} catch (err){
		console.log((`💩 ${red.underline.bold("=> There was an error while copying files =>")} ${orange(err)}`));
	} finally {
		console.log("🐕" + blue.underline.bold(' => Copy files completed!'));
	}
}

/**
 * Edit Json files
 * @param {string} filePath File path
 * @param {string[]} keys Keys to edit
 * @param {string[]} values Values to edit
 * @returns {void}
 */
async function editJson(filePath: string, keys: string[], values: string[] | Object[] ) {
	try {
		const data = await fs.readFile(filePath, 'utf8');

		let jsonData;
		try {
			jsonData = JSON.parse(data);
		} catch (parseError) {
			console.log((`💩 ${red.underline.bold("=> Error parsing JSON =>")} ${orange(parseError)}`));
			return;
		}

		for (const key of keys){
			const index = keys.indexOf(key);
			const value = values[index];
			jsonData[key] = value;
		}

		const updatedJsonData = JSON.stringify(jsonData, null, 2);
		await fs.writeFile(filePath, updatedJsonData, 'utf8');
	} catch (err) {
		console.log((`💩 ${red.underline.bold("=> Error editing JSON Data =>")} ${orange(err)}`));
	} finally {
		console.log("🐕" + blue.underline(` => Updated file ${orange(filePath)}`));
	}
}

async function stringReplace(filePath: string, keys: string[], values: string[]) {
	try {
		let modifiedContent: string = '';
		const data = await fs.readFile(filePath, 'utf8');

		for (const key of keys){
			const index = keys.indexOf(key);
			const value = values[index];
			const regex = new RegExp(`${key}`, 'g');
			modifiedContent = data.replace(regex, `${value}`);
		}

		await fs.writeFile(filePath, modifiedContent, 'utf8');
	} catch (err) {
		console.log((`💩 ${red.underline.bold("=> During string replace =>")} ${orange(err)}`));
	} finally {
		console.log(blue.underline(`🐕 => Updated file ${orange(filePath)}`));
	}
}
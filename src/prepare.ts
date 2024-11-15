import chalk from 'chalk';
import { ModuleSettings, ProjectSettings, blue, green, orange, red, magenta } from './index.js';
import { gitInit, installPackages } from './helpers.js';

/**
 * Init Lucy project
 * @param {string} cwd Current working directory
 * @param {string} packageRoot Package root directory
 * @returns {void}
 */
export async function prepare(moduleSettings: ModuleSettings, projectSettings: ProjectSettings) {
	
	if(!projectSettings.lucySettings?.initialized) {
		console.log((`💩 ${red.underline.bold("=> This project is not initialized =>")} ${orange(moduleSettings.targetFolder)}`));
		console.log("🐕" + magenta.underline(' => Use init to initialize'));
		return;
	}

	await installPackages(projectSettings.lucySettings.wixPackages, projectSettings.lucySettings.devPackages, moduleSettings.targetFolder, moduleSettings.lockVersion);

	await gitInit(moduleSettings.targetFolder, projectSettings?.lucySettings?.modules);

	console.log(chalk.greenBright.underline('🐶 => Prepare done!'));
}
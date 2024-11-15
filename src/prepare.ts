import chalk from 'chalk';
import { ModuleSettings, ProjectSettings, blue, green, orange, red } from './index.js';
import { gitInit, installPackages } from './helpers.js';

/**
 * Init Lucy project
 * @param {string} cwd Current working directory
 * @param {string} packageRoot Package root directory
 * @returns {void}
 */
export async function prepare(moduleSettings: ModuleSettings, projectSettings: ProjectSettings) {
	
	if(projectSettings.lucySettings?.initialized) {
		console.log((`💩 ${red.underline.bold("=> This project is already initialized =>")} ${orange(moduleSettings.targetFolder)}`));
		return;
	}

	await installPackages(moduleSettings.settings.wixPackages, moduleSettings.settings.devPackages, moduleSettings.targetFolder, moduleSettings.lockVersion);

	await gitInit(moduleSettings.targetFolder, projectSettings?.lucySettings?.modules ? projectSettings?.lucySettings?.modules : moduleSettings.settings.modules);

	console.log(chalk.greenBright.underline('🐶 => Initialization done!'));
}
#!/usr/bin/env node --no-warnings
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import chalk from 'chalk';
import settings from './settings.json' assert { type: 'json' };
import projectPackageJSON from '../package.json' assert { type: 'json' };
import lucyJSON from '../files/lucy.json' assert { type: 'json' };

import { join } from 'path';
import fs from 'fs/promises';

import { init } from './init.js';
import { sync } from './sync.js';
import { dev, installPackages } from './helpers.js';
import { prepare } from './prepare.js';

export type LucySettings = {
	modules: {
		[llibName: string]: string;
	};
	wixSettings: {
		compilerOptions: {
			composite: boolean;
			noEmit: boolean;
			lib: string[];
			jsx: string;
		};
		exclude: string[];
	};
	initialized: boolean;
	wixPackages: {
		[packageName: string]: string;
	};
	devPackages: {
		[packageName: string]: string;
	};
	scripts: {
		[commandName: string]: string;
	};
  };

export type ModuleSettings = {
	packageRoot: string;
	targetFolder: string;
	args: string[];
	wixConfigPath: string;
	lucyConfigPath: string;
	packageJsonPath: string;
	settings: typeof settings;
	lucyJSON: typeof lucyJSON;
	lockVersion: boolean;
}

export type ProjectSettings = {
	// packages?: Record<string, string>;
	modules?: Record<string, string>;
	lucySettings?: LucySettings;
	packageJSON?: Record<string, any>;
	lucyJSON?: Record<string, any>;
	force: boolean;
}

export const orange = chalk.hex('#FFA500');
export const blue = chalk.blueBright;
export const green = chalk.greenBright;
export const red = chalk.redBright;
export const yellow = chalk.yellow;
export const magenta = chalk.magentaBright;

// eslint-disable-next-line @typescript-eslint/naming-convention
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line @typescript-eslint/naming-convention
const __dirname = dirname(__filename);


/**
 * Main function
 * @returns {Promise<void>}
 */
async function main(): Promise<void> {

	const moduleSettings: ModuleSettings = {
		packageRoot: dirname(__dirname),
		targetFolder: process.cwd(),
		args:  process.argv.slice(2),
		settings,
		wixConfigPath: join(process.cwd(), 'wix.config.json'),
		lucyConfigPath: join(process.cwd(), 'lucy.json'),
		packageJsonPath: join(process.cwd(), 'package.json'),
		lucyJSON,
		lockVersion: false
	}

	let projectSettings: ProjectSettings = {
		force: false
	}; 

	if(moduleSettings.args.includes('version') || moduleSettings.args.includes('-v')){
		console.log("🐾" + blue.bold(` => ${projectPackageJSON.version}`));
        
		return;
	}

	if(moduleSettings.args.includes('help') || moduleSettings.args.includes('-h')){
		console.log("🦮 " + green.underline.bold(' => Lucy CLI Help'));
		console.log("Usage: lucy-cli <command> [options]");
		console.log("\nCommands:");
		console.log("🦮 " + magenta.bold('init') + "               : Initializes caontaining a WIX project to enable full TS support");
		console.log("🦮 " + magenta.bold('dev') + "                : Starts the development environment. This includes setting up any required services for local development.");
		console.log("🦮 " + magenta.bold('build-prod') + "         : Builds the project in production mode, optimizing files for deployment.");
		console.log("🦮 " + magenta.bold('prepare') + "            : Prepares the project by installing packages & initializing git modules, configured in lucy.json");
		console.log("🦮 " + magenta.bold('sync') + "               : Synchronizes the database (not Implemented)");
		console.log("🦮 " + magenta.bold('install') + "            : Installs all Wix npm packages listed in the 'lucy.json' file in the project directory.");
		console.log("🦮 " + magenta.bold('fix') + "                : Runs a fix command to resolve common issues in development or production settings.");
		console.log("\nOptions:");
		console.log("🦮 " + magenta.bold('-h, help') + "           : Displays this help message.");
		console.log("🦮 " + magenta.bold('-v, version') + "        : Displays the current version of Lucy CLI as defined in the project’s package.json.");
		console.log("🦮 " + magenta.bold('-f, force') + "          : Forces specific commands to execute even if they may lead to potential issues.");
		console.log("                      Used for functions like deleting obsolete pages or initializing missing components.");
		console.log("🦮 " + magenta.bold('-l') + "                  : Locks package versions to those specified in the configuration file lucy.json");
		console.log("\nExamples:");
		console.log("🦮 " + magenta.bold('lucy-cli init') + "       : Initializes a new Wix project.");
		console.log("🦮 " + magenta.bold('lucy-cli dev') + "        : Starts the development environment.");
		console.log("🦮 " + magenta.bold('lucy-cli sync') + "       : Synchronizes database and settings.");
		console.log("🦮 " + magenta.bold('lucy-cli install') + "    : Installs all Wix npm packages from 'lucy.json'.");
		console.log("🦮 " + magenta.bold('lucy-cli dev -f') + "     : Starts the dev environment with forced settings.");
		console.log("🦮 " + magenta.bold('lucy-cli install -l') + " : Installs Wix npm packages, respecting locked versions specified in the configuration.");
        
		return;
	}

	if (!existsSync(moduleSettings.wixConfigPath)) {
		console.log((`💩 ${red.underline.bold("=> This is not a WIX project =>")} ${orange(moduleSettings.targetFolder)}`));
		return;
    }

	if(existsSync(moduleSettings.packageJsonPath)) {
		const packageJSONraw = await fs.readFile(join(moduleSettings.packageJsonPath), 'utf8');
		try {
			projectSettings.packageJSON = JSON.parse(packageJSONraw);
			if(moduleSettings.args.includes('-f')) {
				console.log("❗️" + red.underline(' => Forcing'));
				projectSettings.force = true;
			}
		} catch (parseError) {
			console.log((`💩 ${red.underline.bold("=> Error parsing package.json =>")} ${orange(parseError)}`));
			return;
		}
	}

	if(existsSync(moduleSettings.lucyConfigPath)) {
		try {
			const data = await fs.readFile(moduleSettings.lucyConfigPath, 'utf8');
			projectSettings.lucySettings = JSON.parse(data);
		} catch (parseError) {
			console.log((`💩 ${red.underline.bold("=> Error parsing Lucy.json =>")} ${orange(parseError)}`));
		}
	} else {
		if(!moduleSettings.args.includes('init')) {
			return console.log(yellow.underline.bold('🐶 => Project not Initialized! Please initialize using "lucy-cli init"'));
		};
	}
    
	if(moduleSettings.args.includes('-l')) moduleSettings.lockVersion = true;

	if(moduleSettings.args.includes('init')){
		console.log("🐕" + magenta.underline(' => Initializing project'));
		init(moduleSettings, projectSettings);
		
		return;
	}

	if(moduleSettings.args.includes('prepare')){
		console.log("🐕" + magenta.underline(' => Preparing project'));
		init(moduleSettings, projectSettings);
		
		return;
	}

	if(moduleSettings.args.includes('install')){
		await installPackages( moduleSettings.settings.wixPackages, moduleSettings.settings.devPackages, moduleSettings.targetFolder, moduleSettings.lockVersion);

		return;
	}

	if(moduleSettings.args.includes('prepare')){
		await prepare( moduleSettings, projectSettings);

		return;
	}


	if(moduleSettings.args.includes('sync')){
		sync(moduleSettings, projectSettings);

		return;
	}

	if(moduleSettings.args.includes('dev')){
		dev(moduleSettings, projectSettings, 'dev');

		return;	
	}
	if(moduleSettings.args.includes('build-prod')){
		dev(moduleSettings, projectSettings, 'build-prod');

		return;	
	}
	if(moduleSettings.args.includes('fix')){
		dev(moduleSettings, projectSettings, 'fix');

		return;	
	}

	console.log("🐕" + blue.underline.bold(' => Running dev'));
	dev(moduleSettings, projectSettings, 'dev');
}

main();
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
import { Config } from "./config.js";
import { Command, Terminal, FileSystem, Path } from "@effect/platform"
import { config } from "yargs";
import { JsonSchema } from "./schemas/index.js";

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

const init_expo = () => {
    return Effect.gen(function*() {
        const config = yield* Config;
        const terminal = yield* Terminal.Terminal;
        const fs = yield* FileSystem.FileSystem;
        const path = yield* Path.Path;

        const yarn = Command.make(
                "yarn",
                "add",
                "nativewind",
                "react-native-reanimated@~3.17.4",
                "react-native-safe-area-context@5.4.0",
                "@wix/sdk@1.15.24",
                "@wix/data",
                "expo-standard-web-crypto",
                "effect",
                "node-libs-react-native",
                "util",
                "events",
                "tailwindcss-animate",
            ).pipe(
            Command.stdout("inherit"), // Stream stdout to process.stdout
            Command.exitCode // Get the exit code
        )
        const yarnVersion = Command.make(
                "yarn",
                "set",
                "version",
                "berry"
            ).pipe(
            Command.stdout("inherit"), // Stream stdout to process.stdout
            Command.exitCode // Get the exit code
        )

        const yarnDev = Command.make(
                "yarn",
                "add",
                "--dev",
                "tailwindcss@^3.4.17",
                "prettier-plugin-tailwindcss@^0.5.11",
                "@styled/typescript-styled-plugin",
                "typescript-eslint-language-service",
                "eslint-config-prettier",
                "eslint-plugin-jsdoc",
                "eslint-plugin-named-import-spacing",
                "eslint-plugin-only-warn",
                "eslint-plugin-react",
                "eslint-plugin-react-hooks",
                "eslint-plugin-simple-import-sort",
                "@next/eslint-plugin-next",
                "@styled/typescript-styled-plugin",
                "@stylelint/postcss-css-in-js",
                "@typescript-eslint/parser",
                "typescript-eslint",
                "typescript-eslint-language-service",
                "@total-typescript/ts-reset",
                "expo-doctor",
                "tsx",
            ).pipe(
            Command.stdout("inherit"), // Stream stdout to process.stdout
            Command.exitCode // Get the exit code
        )

        const npx = Command.make(
                "npx",
                "expo",
                "install",
                "tailwindcss-animate",
                "class-variance-authority",
                "clsx",
                "tailwind-merge",
                "expo-crypto",
                "react-dom", 
                "react-native-web", 
                "@expo/metro-runtime",
                "expo-system-ui"
            ).pipe(
                Command.stdout("inherit"), // Stream stdout to process.stdout
                Command.exitCode // Get the exit code
        )

        const projectName = config.config.cwd.split('/').pop() || 'expo-project';

        const appJsonRaw = yield* fs.readFile("app.json").pipe(Effect.catchAll((error) => {
            return Effect.succeed('{}');
        }))
        const lucyJsonRaw = yield* fs.readFile("lucy.json").pipe(Effect.catchAll((error) => {
            return Effect.succeed('{}');
        }))
        const appJSON = Schema.decodeUnknownSync(JsonSchema)(appJsonRaw.toString()) as any;
        const lucyJSON = Schema.decodeUnknownSync(JsonSchema)(lucyJsonRaw.toString()) as any;

        const expoAppReady = appJSON.expo ? true : false;
        const lucyInitialized = lucyJSON.initialized ? true : false;
        const gitPresent = yield* fs.exists(config.config.cwd + '/.git')

        const files = yield* fs.readDirectory(config.config.cwd);
        const nonGitFiles = files.filter(file => file !== '.git');

        if(!gitPresent) return yield* Effect.logError("No git repository found. Please initialize a git repository before running this command.");
        if(nonGitFiles.length > 0) return yield* Effect.logError("The current directory is not empty. Please run this command in an empty directory.");
    
        if(!expoAppReady) {
            const initExpo = Command.make("npx", "create-expo-app@latest", projectName, "--template", "blank-typescript", "--no-install").pipe(
                Command.stdout("inherit"), // Stream stdout to process.stdout
                Command.exitCode // Get the exit code
            )
            yield* initExpo

            const projectPath = path.join(config.config.cwd, projectName)

            const projectFiles = yield* fs.readDirectory(projectPath)
            yield* Effect.forEach(
                projectFiles.filter(file => file !== '.git'),
                (file) => fs.copy(path.join(projectPath, file), path.join(config.config.cwd, file), { overwrite: true }),
                { discard: true }
            )
            yield* fs.remove(projectPath, { recursive: true })
        }            
        if(lucyInitialized) return yield* Effect.logError("Lucy is already initialized in this project. Please run this command in an empty directory.");

        const baseFiles = yield* fs.readDirectory(config.config.filesFolder + '/expo')
        yield* Effect.forEach(
            baseFiles,
            (file) => fs.copy(path.join(config.config.filesFolder, 'expo', file), path.join(config.config.cwd, file), { overwrite: true })
        )

        const newScripts = {
            "dev": "expo start",
            "start": "expo start",
            "android": "expo start --android",
            "ios": "expo start --ios",
            "web": "expo start --web",
            "reset": "tsx ./scripts/reset-project.ts",
            "format": "prettier --write \"./*.json\" \"**/*.{ts,tsx,md,json,jsonc,json5}\"",
            "prebuild": "expo prebuild",
            "pods": "npxpod-install",
            "build:dev": "eas build --local --profile development",
            "build:sim": "eas build --local --profile ios-simulator",
            "build:prev": "eas build --local --profile preview",
            "build:prod": "eas build --local --profile production",
            "build:web": "expo export --platform web",
            "doctor": "expo-doctor",
            "eas-build-pre-install": "corepack enable && yarn set version 4"
        }

        const packageJsonPath = path.join(config.config.cwd, "package.json")
        const packageJsonRaw = yield* fs.readFile(packageJsonPath)
        const packageJson = Schema.decodeUnknownSync(JsonSchema)(packageJsonRaw.toString()) as any;

        packageJson.scripts = {
            ...packageJson.scripts,
            ...newScripts,
        };
        packageJson.resolutions = {
            ...packageJson.resolutions,
        };
        packageJson.expo = {
            doctor: {
                reactNativeDirectoryCheck: {
                    listUnknownPackages: false,
                },
            }
        }

        yield* fs.writeFileString(path.join(config.config.cwd, 'package.json'), JSON.stringify(packageJson, null, 2));
        yield* fs.remove(path.join(config.config.cwd, "package-lock.json"), { force: true })


        let res = yield* yarnVersion;
        if (res !== 0) {
            return yield* Effect.logError("Failed to set Yarn version. Please check the error message above.");
        }
        res = yield* yarn
        if (res !== 0) {
            return yield* Effect.logError("Failed to install dependencies. Please check the error message above.");
        }
        res = yield* yarnDev
        if (res !== 0) {
            return yield* Effect.logError("Failed to install dev dependencies. Please check the error message above.");
        }
        res = yield* npx
        if (res !== 0) {
            return yield* Effect.logError("Failed to install Expo dependencies. Please check the error message above.");
        }
    })
}

export const init = () => {
    return Effect.gen(function* (_) {
        const config = yield* Config;
        if(config.config.action.type === undefined) {
            return yield* Effect.fail("No Params Provided");
        }

        if(config.config.action.type === 'expo') {
            return yield* init_expo();
        }

    })
}
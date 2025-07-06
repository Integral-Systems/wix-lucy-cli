#!/usr/bin/env node --no-warnings
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import chalk from 'chalk';
import settings from './settings.json' with { type: "json" };
;
import projectPackageJSON from '../package.json' with { type: "json" };
;
import { join } from 'path';
import fs from 'fs/promises';
import { init } from './init.js';
import { sync } from './sync.js';
import { runGulp, installPackages, killAllProcesses, cleanupWatchers, createTemplateFolder, updateLucyConfigFromPackageJson } from './helpers.js';
import { prepare } from './prepare.js';
import { spawn, spawnSync } from 'child_process';
import os from 'os';
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
// const cwd = process.cwd();
// const command = `watchman watch-del '${cwd}'`;
// killAllProcesses('@wix/cli/bin/wix.cjs'); // Matches processes running the Wix CLI
// killAllProcesses('wix:dev');   
process.on('exit', (code) => {
    killAllProcesses('@wix/cli/bin/wix.cjs'); // Matches processes running the Wix CLI
    killAllProcesses('wix:dev');
    cleanupWatchers();
    console.log(`🚪 ${magenta.underline('Process exiting with code:')} ${orange(code)}`);
});
process.on('SIGINT', () => {
    console.log(`🐕 ${green.underline('Received Ctrl+C (SIGINT), cleaning up...')}`);
    killAllProcesses('@wix/cli/bin/wix.cjs'); // Matches processes running the Wix CLI
    killAllProcesses('wix:dev');
    cleanupWatchers();
    process.exit(); // Exit explicitly after handling
});
process.on('SIGTERM', () => {
    console.log(`🛑 ${red.underline('Received termination signal (SIGTERM), cleaning up...')}`);
    killAllProcesses('@wix/cli/bin/wix.cjs'); // Matches processes running the Wix CLI
    killAllProcesses('wix:dev');
    cleanupWatchers();
    process.exit(); // Exit explicitly after handling
});
process.on('uncaughtException', (error) => {
    console.error(`💥 ${red.underline('Uncaught Exception:')}`, error);
    killAllProcesses('@wix/cli/bin/wix.cjs'); // Matches processes running the Wix CLI
    killAllProcesses('wix:dev');
    cleanupWatchers();
    process.exit(1); // Exit with an error code
});
process.on('unhandledRejection', (reason, promise) => {
    console.error(`🚨 ${yellow.underline('Unhandled Rejection at:')} ${orange(promise)}`);
    console.error(`🚨 ${red.underline('Reason:')} ${reason}`);
    cleanupWatchers();
    killAllProcesses('@wix/cli/bin/wix.cjs'); // Matches processes running the Wix CLI
    killAllProcesses('wix:dev');
    cleanupWatchers();
    process.exit(1); // Exit with an error code
});
/**
 * Main function
 * @returns {Promise<void>}
 */
async function main() {
    // INFO: Module settings
    const moduleSettings = {
        packageRoot: dirname(__dirname),
        targetFolder: process.cwd(),
        args: process.argv.slice(2),
        settings,
        wixConfigPath: join(process.cwd(), 'wix.config.json'),
        lucyConfigPath: join(process.cwd(), 'lucy.json'),
        packageJsonPath: join(process.cwd(), 'package.json'),
        force: false,
        lockVersion: false,
        veloConfigName: 'config.json'
    };
    let projectSettings = {};
    if (moduleSettings.args.includes('version') || moduleSettings.args.includes('-v')) {
        console.log("🐾" + blue.bold(` => ${projectPackageJSON.version}`));
        return;
    }
    if (moduleSettings.args.includes('templates')) {
        const templatesPath = join(os.homedir(), '.lucy-cli');
        if (!existsSync(templatesPath)) {
            console.log((`💩 ${red.underline.bold("=> Lucy templates folder not found at =>")} ${orange(templatesPath)}`));
            console.log(chalk.yellow('🐕 Creating templates folder with default template...'));
            await createTemplateFolder(moduleSettings);
        }
        console.log(`🐕 ${blue.underline('Opening templates folder at:')} ${orange(templatesPath)}`);
        let command;
        switch (process.platform) {
            case 'darwin':
                command = 'open';
                break;
            case 'win32':
                command = 'start';
                break;
            default:
                command = 'xdg-open';
                break;
        }
        const child = spawn(command, [templatesPath], { detached: true, stdio: 'ignore' });
        child.on('error', (err) => {
            console.error(`💩 ${red.underline.bold('Failed to open folder:')} ${orange(err.message)}`);
        });
        child.unref();
        return;
    }
    // Run velo sync
    if (moduleSettings.args.includes('velo-sync')) {
        await sync(moduleSettings, projectSettings);
        return;
    }
    if (moduleSettings.args.includes('help') || moduleSettings.args.includes('-h')) {
        console.log("🦮 " + green.underline.bold(' => Lucy CLI Help'));
        console.log("Usage: lucy-cli <command> [options]");
        console.log("\nCommands:");
        console.log("🦮 " + magenta.bold('init') + "               : Initializes caontaining a WIX project to enable full TS support");
        console.log("🦮 " + magenta.bold('dev') + "                : Starts the development environment. This includes setting up any required services for local development.");
        console.log("🦮 " + magenta.bold('build-prod') + "         : Builds the project in production mode, optimizing files for deployment.");
        console.log("🦮 " + magenta.bold('prepare') + "            : Prepares the project by installing packages & initializing git modules, configured in lucy.json");
        console.log("🦮 " + magenta.bold('velo-sync') + "          : Synchronizes wix collections(velo-sync -h for help)");
        console.log("🦮 " + magenta.bold('install') + "            : Installs all Wix npm packages listed in the 'lucy.json' file in the project directory.");
        console.log("🦮 " + magenta.bold('fix') + "                : Runs a fix command to resolve common issues in development or production settings.");
        console.log("🦮 " + magenta.bold('docs') + "               : Generates documentation for the project.");
        console.log("🦮 " + magenta.bold('cypress') + "            : Starts the cypress test runner.");
        console.log("🦮 " + magenta.bold('templates') + "          : Opens the Lucy CLI templates folder.");
        console.log("🦮 " + magenta.bold('sync-pkgs') + "          : Syncs dependencies from package.json to lucy.json.");
        console.log("🦮 " + magenta.bold('e2e') + "                : Starts the cypress test runner in CI mode. first argument is the key second is the build id <e2e <somekey <someID>");
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
    //INFO: Collect project settings
    if (moduleSettings.args.includes('-f'))
        moduleSettings.force = true;
    if (moduleSettings.args.includes('-l'))
        moduleSettings.lockVersion = true;
    if (existsSync(moduleSettings.packageJsonPath)) {
        const packageJSONraw = await fs.readFile(join(moduleSettings.packageJsonPath), 'utf8');
        try {
            projectSettings.packageJSON = JSON.parse(packageJSONraw);
            if (moduleSettings.force) {
                console.log("❗️" + red.underline(' => Forcing'));
                moduleSettings.force = true;
            }
        }
        catch (parseError) {
            console.log((`💩 ${red.underline.bold("=> Error parsing package.json =>")} ${orange(parseError)}`));
            return;
        }
    }
    if (existsSync(moduleSettings.lucyConfigPath)) {
        try {
            const data = await fs.readFile(moduleSettings.lucyConfigPath, 'utf8');
            projectSettings.lucySettings = JSON.parse(data);
        }
        catch (parseError) {
            console.log((`💩 ${red.underline.bold("=> Error parsing Lucy.json =>")} ${orange(parseError)}`));
        }
    }
    else {
        if (!moduleSettings.args.includes('init')) {
            return console.log(yellow.underline.bold('🐶 => Project not Initialized! Please initialize using "lucy-cli init"'));
        }
        ;
    }
    if (!projectSettings.lucySettings?.initialized) {
        if (!moduleSettings.args.includes('init')) {
            return console.log(yellow.underline.bold('🐶 => Project not Initialized! Please initialize using "lucy-cli init"'));
        }
    }
    if (moduleSettings.args.includes('-l'))
        moduleSettings.lockVersion = true;
    console.log("🐕" + magenta.underline(' => Lucy CLI => RUNNING: ' + orange('Press Ctrl+C to stop.')));
    // INFO: Run commands
    if (moduleSettings.args.includes('init')) {
        if (projectSettings.lucySettings?.initialized && !moduleSettings.force) {
            console.log((`💩 ${red.underline.bold("=> This project is already initialized =>")} ${orange(moduleSettings.targetFolder)}`));
            console.log("🐕" + magenta.underline(' => Use -f to force initialization'));
            return;
        }
        console.log("🐕" + magenta.underline(' => Initializing project'));
        init(moduleSettings, projectSettings);
        return;
    }
    if (moduleSettings.args.includes('docs')) {
        const res = spawnSync('yarn docs', { shell: true, stdio: 'inherit' });
        if (res.error) {
            return console.log((`💩 ${red.underline.bold("=> Failed to Docs generated => ")} ${orange(res.error.message)}`));
        }
        return console.log("🐕" + blue.underline(` => Docs generated!`));
    }
    if (moduleSettings.args.includes('cypress')) {
        const res = spawnSync('yarn cypress', { shell: true, stdio: 'inherit' });
        if (res.error) {
            return console.log((`💩 ${red.underline.bold("=> Failed to start cypress => ")} ${orange(res.error.message)}`));
        }
        return console.log("🐕" + blue.underline(` => Started Cypress`));
    }
    if (moduleSettings.args.includes('e2e')) {
        // Extract arguments
        const e2eIndex = moduleSettings.args.indexOf('e2e');
        const key = moduleSettings.args[e2eIndex + 1];
        const buildId = moduleSettings.args[e2eIndex + 2];
        // Validate that both arguments are provided
        if (!key && !buildId) {
            console.log(`💩 ${red.underline.bold("=> Missing required arguments:")} ${orange("key")} and ${orange("build ID")}`);
            process.exit(1);
        }
        // Run Cypress with the provided arguments
        const res = spawnSync(`yarn e2e --key ${key} --ci-build-id ${buildId}`, { shell: true, stdio: 'inherit' });
        if (res.error) {
            console.log(`💩 ${red.underline.bold("=> Failed to start Cypress =>")} ${orange(res.error.message)}`);
            process.exit(1);
        }
        return console.log("🐕 " + blue.underline(`=> Started Cypress successfully`));
    }
    if (moduleSettings.args.includes('prepare')) {
        await prepare(moduleSettings, projectSettings);
        return;
    }
    if (moduleSettings.args.includes('install')) {
        if (!projectSettings.lucySettings?.initialized) {
            console.log((`💩 ${red.underline.bold("=> This project is not initialized =>")} ${orange(moduleSettings.targetFolder)}`));
            console.log("🐕" + magenta.underline(' => Use init to initialize'));
            return;
        }
        await installPackages(projectSettings.lucySettings.wixPackages, projectSettings.lucySettings.devPackages, moduleSettings.targetFolder, moduleSettings.lockVersion);
        return;
    }
    if (moduleSettings.args.includes('dev')) {
        runGulp(moduleSettings, projectSettings, 'dev');
        return;
    }
    if (moduleSettings.args.includes('build-prod')) {
        runGulp(moduleSettings, projectSettings, 'build-prod');
        return;
    }
    if (moduleSettings.args.includes('fix')) {
        runGulp(moduleSettings, projectSettings, 'fix-wix');
        return;
    }
    if (moduleSettings.args.includes('sync-pkgs')) {
        console.log("🐕" + magenta.underline(' => Syncing package.json with lucy.json'));
        if (!existsSync(moduleSettings.packageJsonPath)) {
            console.log((`💩 ${red.underline.bold("=> package.json not found at =>")} ${orange(moduleSettings.packageJsonPath)}`));
            return;
        }
        if (!existsSync(moduleSettings.lucyConfigPath)) {
            console.log((`💩 ${red.underline.bold("=> lucy.json not found at =>")} ${orange(moduleSettings.lucyConfigPath)}`));
            return;
        }
        await updateLucyConfigFromPackageJson(moduleSettings.packageJsonPath, moduleSettings.lucyConfigPath);
        return;
    }
    console.log("🐕" + blue.underline.bold(' => Running dev'));
    runGulp(moduleSettings, projectSettings, 'dev');
}
main();

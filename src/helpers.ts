import chalk from 'chalk';
import { simpleGit } from 'simple-git';
import { spawnSync, exec } from 'child_process';
// https://www.sergevandenoever.nl/run-gulp4-tasks-programatically-from-node/
import path, { join } from 'path';
import { fileURLToPath } from 'url';
import { LucySettings, ModuleSettings, ProjectSettings } from '.';
import os from 'os';
import fs, { mkdirSync } from 'fs';
import fse from 'fs-extra';
import { writeFile } from 'fs/promises';

import { blue, green, orange, red, yellow, magenta } from './index.js';

export async function installPackages(wixPackages: Record<string, string>, devPackages: Record<string, string>,  cwd: string, locked: boolean ) {
	if (locked) console.log("🐕" + blue.underline(` => Installing & version locked packages!`));

	const wixPackageNames = Object.keys(wixPackages);
	const wixPackageVersions = Object.values(wixPackages);
	const wixPackageNamesAndVersions = wixPackageNames.map((name, index) => `${name}@${wixPackageVersions[index]}`);

	const devPackageNames = Object.keys(devPackages);
	const devPackageVersions = Object.values(devPackages);
	const devPackageNamesAndVersions = devPackageNames.map((name, index) => `${name}@${devPackageVersions[index]}`);

	let success = true;

    // Dev packages are installed all at once with yarn.
	if (devPackageNames.length > 0) {
		console.log(`🐕 => Installing dev packages with yarn...`);
		const packagesToInstall = locked ? devPackageNamesAndVersions.join(' ') : devPackageNames.join(' ');
		const yarnAdd = `yarn add -D ${packagesToInstall}`;
		const yarnRes = spawnSync(yarnAdd, { shell: true, stdio: 'inherit' });
		if (yarnRes.error) {
			success = false;
			console.log((`💩 ${red.underline.bold("=> Failed to install dev packages =>")} ${orange(yarnRes.error.message)}`));
		} else {
			console.log("🐕" + blue.underline(` => Dev packages installed!`));
		}
	}

	// Packages are installed all at once with yarn.
    if (wixPackageNames.length > 0) {
		console.log(`🐕 => Installing packages with yarn...`);
		const packagesToInstall = locked ? wixPackageNamesAndVersions.join(' ') : wixPackageNames.join(' ');
		const yarnAdd = `yarn add ${packagesToInstall}`;
		const yarnRes = spawnSync(yarnAdd, { shell: true, stdio: 'inherit' });
		if (yarnRes.error) {
			success = false;
			console.log((`💩 ${red.underline.bold("=> Failed to install packages =>")} ${orange(yarnRes.error.message)}`));
		} else {
			console.log("🐕" + blue.underline(` => Packages installed!`));
		}
	}

	// Wix packages are installed one by one.
	if (wixPackageNames.length > 0) {
		wixPackageNames.forEach((name, index) => {
			console.log(`🐕 => Installing wix package ${orange(name)}`);
			const wixInstall = locked ? `wix install ${wixPackageNamesAndVersions[index]}`: `wix install ${name}`;
			const wixres = spawnSync(wixInstall, { shell: true, stdio: 'inherit' });
			if (wixres.error) {
				console.log((`💩 ${red.underline.bold("=> Failed to install wix package =>")} ${orange(wixres.error.message)}`));
				success = false;
			} else {
				console.log("🐕" + blue.underline(` => Wix package ${orange(name)} installed!`));
			}
		});
	}

	if(success) {
		console.log("🐕" + blue.underline(` => All Packages installed!`));
	} else {
		console.log("🐕" + red.underline(` => Some packages failed to install!`));
	}																
}

export async function gitInit(cwd: string, modules: LucySettings['modules']) {
	for (const [name, repo] of Object.entries(modules)) {
		console.log(chalk.green.underline.bold(`Cloning ${name}`));
        const git = simpleGit({ baseDir: cwd });

		try {
            const repoPath = path.resolve(cwd, name);
            if (!fs.existsSync(repoPath)) {
                await git.submoduleAdd(repo.url, name)
            }

            if (fs.existsSync(repoPath)) {
                console.log(`🐕 ${blue.underline(' => Module already cloned!')}`);
            }

            const localGit = simpleGit({ baseDir: `${cwd}/${name}` });
            await localGit.checkout(repo.branch);
		} catch (err) {
			console.log((`💩 ${red.underline.bold("=> Command failed =>")} ${orange(err)}`));
		} finally {	
			console.log("🐕" + blue.underline(` => Cloned ${orange(name)}`));
		}
	}
	console.log("🐶" + green.underline(' => All Modules cloned!'));
}


export async function runGulp(moduleSettings: ModuleSettings, projectSettings: ProjectSettings, task: string) {
    // Get the directory name of the current module
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Resolve the path to the Gulpfile
    const gulpfilePath = path.resolve(__dirname, 'Gulpfile.js');

    // Dynamically import the Gulpfile
    const gulpfile = await import(`file://${gulpfilePath}`);

    // Check if 'dev' task exists
    gulpfile.runTask(task, moduleSettings, projectSettings)
}


/**
 * Clean up and run a command before exiting the process.
 */
export function cleanupWatchers() {
    console.log(`🧹 ${magenta.underline('Cleaning up Watchman watchers...')}`);
    const cwd = process.cwd();
    const command = `watchman watch-del "${cwd}"`; // Adjust for Windows paths
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`💩 ${red.underline('Failed to run cleanup:')} ${orange(error.message)}`);
            return;
        }
        if (stderr) {
            console.error(`⚠️ ${yellow.underline('Watchman stderr:')} ${stderr}`);
        }
        console.log(`✅ ${green.underline('Watchman cleanup success:')} ${stdout}`);
    });
}

/**
 * Kill all processes matching a specific substring in their command, with a fallback for Windows.
 * @param {string} processPattern - The substring to match (e.g., "wix:dev" or "@wix/cli/bin/wix.cjs").
 */
export function killAllProcesses(processPattern: string) {
    const isWindows = os.platform() === 'win32';
    const command = isWindows
        ? `tasklist /FI "IMAGENAME eq node.exe" /FO CSV | findstr "${processPattern}"` // Adjust for Node.js processes
        : `ps -eo pid,command | grep "${processPattern}" | grep -v grep`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`💩 ${red.underline('Failed to find processes:')} ${orange(error.message)}`);
            return;
        }
        if (stderr) {
            console.error(`⚠️ ${yellow.underline('Error output:')} ${stderr}`);
        }
        if (!stdout.trim()) {
            console.log(`ℹ️ ${blue.underline(`No processes found matching pattern:`)} ${orange(processPattern)}`);
            return;
        }

        console.log(`📝 ${magenta.underline('Found matching processes:')}\n${stdout}`);
        const lines = stdout.trim().split('\n');
        const pids = isWindows
            ? lines.map(line => line.match(/"(\d+)"/)?.[1]) // Extract PID from Windows tasklist output
            : lines.map(line => line.trim().split(/\s+/)[0]).filter(pid => !isNaN(Number(pid)));

        pids.forEach(pid => {
            if (!pid) return;
            try {
                const killCommand = isWindows
                    ? `taskkill /PID ${pid} /T /F` // Forcefully terminate the process on Windows
                    : `kill -SIGTERM ${pid}`;
                
                exec(killCommand, (killError) => {
                    if (killError) {
                        console.error(`⚠️ ${yellow.underline('Failed to kill process with PID')} ${orange(pid)}: ${red(killError.message)}`);
                    } else {
                        console.log(`✅ ${green.underline('Killed process with PID:')} ${orange(pid)}`);
                    }
                });

                // Schedule SIGKILL fallback for non-Windows platforms
                if (!isWindows) {
                    setTimeout(() => {
                        try {
                            process.kill(parseInt(pid, 10), 'SIGKILL');
                            console.log(`🔪 ${red.underline('Sent SIGKILL to process with PID:')} ${orange(pid)} (fallback).`);
                        } catch (killError: any) {
                            if (killError.code === 'ESRCH') {
                                console.log(`✅ ${green.underline('Process with PID')} ${orange(pid)} ${green.underline('already terminated.')}`);
                            } else {
                                console.error(`⚠️ ${yellow.underline('Failed to send SIGKILL to process with PID')} ${orange(pid)}: ${red(killError.message)}`);
                            }
                        }
                    }, 10000);
                }
            } catch (err: any) {
                console.error(`⚠️ ${yellow.underline('Failed to kill process with PID')} ${orange(pid)}: ${red(err.message)}`);
            }
        });
    });
}

export interface VeloSyncConfig {
    siteUrl: string;
    secret: string;
}
export async function saveConfig(config:VeloSyncConfig, file: string) {
    await fs.promises.writeFile(file, JSON.stringify(config));
}
export async function readConfig(file: string): Promise<VeloSyncConfig> {
    let content = await fs.promises.readFile(file, 'utf-8');
    return JSON.parse(content);
}

export async function createTemplateFolder(moduleSettings: ModuleSettings) {
        const templatesPath = join(os.homedir(), '.lucy-cli');
    
            try {
            mkdirSync(templatesPath);

            const defaultTemplatePath = join(templatesPath, 'default');
            mkdirSync(defaultTemplatePath);

            const sourceFilesPath = join(moduleSettings.packageRoot, 'files');
            const defaultTemplateFilesPath = join(defaultTemplatePath, 'files');
            await fse.copy(sourceFilesPath, defaultTemplateFilesPath);

            const defaultTemplateSettingsPath = join(defaultTemplatePath, 'settings.json');
            await writeFile(defaultTemplateSettingsPath, JSON.stringify(moduleSettings.settings, null, 2));

            console.log(green('✅ Default template created successfully!'));
        } catch (e) {
            console.log((`💩 ${red.underline.bold("=> Error creating default template =>")} ${orange(e)}`));
            return;
        }
}

export type PackageJson = {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    [key: string]: any;
}

/**
 * Updates a lucy.json file with dependencies from a package.json file.
 * It replaces 'wixPackages' with 'dependencies' and 'devPackages' with 'devDependencies'.
 * @param {string} packageJsonPath - Path to the package.json file.
 * @param {string} lucyConfigPath - Path to the lucy.json file.
 */
export async function updateLucyConfigFromPackageJson(packageJsonPath: string, lucyConfigPath: string): Promise<void> {
    try {
        console.log(`🐕 Reading package definitions from ${orange(packageJsonPath)}...`);
        const pkgJsonContent = await fs.promises.readFile(packageJsonPath, 'utf-8');
        const packageJson: PackageJson = JSON.parse(pkgJsonContent);

        console.log(`🐕 Reading Lucy configuration from ${orange(lucyConfigPath)}...`);
        const lucyConfigContent = await fs.promises.readFile(lucyConfigPath, 'utf-8');
        const lucyConfig: LucySettings = JSON.parse(lucyConfigContent);

        const { dependencies = {}, devDependencies = {} } = packageJson;

        // Note: `wixPackages` are installed using `wix install`. If your `dependencies`
        // contain packages that are not Wix packages, `lucy-cli install` might fail.
        lucyConfig.wixPackages = dependencies;
        lucyConfig.devPackages = devDependencies;

        console.log(`🐕 Writing updated configuration to ${orange(lucyConfigPath)}...`);
        await fs.promises.writeFile(lucyConfigPath, JSON.stringify(lucyConfig, null, 2));

        console.log(green.underline('✅ Lucy configuration updated successfully!'));

    } catch (error: any) {
        console.error(`💩 ${red.underline.bold('=> Error updating lucy.json from package.json:')} ${orange(error.message)}`);
        throw error; // re-throw to allow caller to handle
    }
}
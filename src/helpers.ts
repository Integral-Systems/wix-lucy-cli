import chalk from 'chalk';
import { join } from 'path';
import { simpleGit } from 'simple-git';
import fs from 'fs/promises';
import { spawnSync } from 'child_process';
// https://www.sergevandenoever.nl/run-gulp4-tasks-programatically-from-node/
import path from 'path';
import { fileURLToPath } from 'url';
import { ModuleSettings, ProjectSettings } from '.';

import { blue, green, orange, red } from './index.js';

export async function installPackages(wixPackages: Record<string, string>, devPackages: Record<string, string>,  cwd: string, locked: boolean ) {
	if (locked) console.log("🐕" + blue.underline(` => Installing & version locked packages!`));

	const wixPackageNames = Object.keys(wixPackages);
	const wixPackageVersions = Object.values(wixPackages);
	const wixPackageNamesAndVersions = wixPackageNames.map((name, index) => `${name}@${wixPackageVersions[index]}`);

	const devPackageNames = Object.keys(devPackages);
	const devPackageVersions = Object.values(devPackages);
	const devPackageNamesAndVersions = devPackageNames.map((name, index) => `${name}@${devPackageVersions[index]}`);

	let success = true;
	wixPackageNames.forEach((name, index) => {
		console.log(`🐕 => Installing ${orange(name)}`);
		const wixInstall = locked ? `wix install ${wixPackageNamesAndVersions}`: `wix install ${name}`;
		const wixres = spawnSync(wixInstall, { shell: true, stdio: 'inherit' });
		if (wixres.error) {
			console.log((`💩 ${red.underline.bold("=> Failed to install package =>")} ${orange(wixres.error.message)}`));
			success = false;
		} else {
			console.log("🐕" + blue.underline(` => Package installed!`));
		}
	});
	const yarnAdd = locked ? `yarn add -D ${devPackageNamesAndVersions.join(' ')}` : `yarn add -D ${devPackageNames.join(' ')}`;
	const yarnRes = spawnSync(yarnAdd, { shell: true, stdio: 'inherit' });
	if (yarnRes.error) {
		success = false;
		console.log((`💩 ${red.underline.bold("=> Failed to install dev packages =>")} ${orange(yarnRes.error.message)}`));
	}

	if(success) {
		console.log("🐕" + blue.underline(` => All Packages installed!`));
	} else {
		console.log("🐕" + red.underline(` => Some packages failed to install!`));
	}																
}

export async function gitInit(cwd: string, modules: Record<string, string>) {
	const git = simpleGit({ baseDir: cwd });
	for (const [name, url] of Object.entries(modules)) {
		console.log(chalk.green.underline.bold(`Cloning ${name}`));
		try {
			await git.submoduleAdd(url, name)
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
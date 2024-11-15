import chalk from 'chalk';
import { existsSync, mkdirSync, promises as fsPromises } from 'fs';
import fse from 'fs-extra';
import { join } from 'path';
import { simpleGit } from 'simple-git';
import fs from 'fs/promises';
import { spawnSync } from 'child_process';
import path from 'path';
import { blue, green, orange, red } from './index.js';
/**
 * Init Lucy project
 * @param {string} cwd Current working directory
 * @param {string} packageRoot Package root directory
 * @returns {void}
 */
export async function init(moduleSettings, projectSettings) {
    if (projectSettings.packageJSON && projectSettings.packageJSON.wixLucy?.initialized && !moduleSettings.args.includes('-f')) {
        console.log((`💩 ${red.underline.bold("=> This project is already initialized =>")} ${orange(moduleSettings.targetFolder)}`));
        return;
    }
    await copyFolder(join(moduleSettings.packageRoot, 'files'), moduleSettings.targetFolder);
    await editJson(moduleSettings.packageJsonPath, ['type', 'scripts', 'wixLucy'], ['module', moduleSettings.settings.scripts, moduleSettings.settings.lucySettings]);
    await stringReplace(join(moduleSettings.targetFolder, 'currents.config.js'), ['__ProjectName__'], [path.basename(moduleSettings.targetFolder)]);
    await installPackages(moduleSettings.settings.wixPackages, moduleSettings.settings.devPackages, moduleSettings.targetFolder);
    await editJson(join(moduleSettings.targetFolder, 'jsconfig.json'), ['compilerOptions', 'exclude'], [moduleSettings.settings.wixSettings.compilerOptions, moduleSettings.settings.wixSettings.exclude]);
    await editJson(join(moduleSettings.targetFolder, 'typedoc.json'), ['name'], [path.basename(moduleSettings.targetFolder)]);
    await gitInit(moduleSettings.targetFolder, projectSettings?.lucySettings?.modules ? projectSettings?.lucySettings?.modules : moduleSettings.settings.modules);
    console.log(chalk.greenBright.underline('🐶 => Initialization done!'));
}
/**
 * Copy files from source to target
 * @param {string} source Source folder
 * @param {string} target Target folder
 * @returns {Promise<void>}
 */
async function copyFolder(source, target) {
    if (!existsSync(target)) {
        console.log((`💩 ${red.underline.bold("=> Target folder doesn't exist =>")} ${orange(target)}`));
        return;
    }
    try {
        const files = await fsPromises.readdir(source);
        for (const file of files) {
            const sourcePath = join(source, file);
            const targetPath = join(target, file);
            if (file === 'lucy.json' && existsSync(targetPath)) {
                continue;
            }
            const stats = await fsPromises.stat(sourcePath);
            if (stats.isDirectory()) {
                if (!existsSync(file)) {
                    mkdirSync(file);
                }
                await fse.copySync(sourcePath, targetPath, { overwrite: true });
            }
            else {
                fse.copySync(sourcePath, targetPath, { overwrite: true });
            }
        }
    }
    catch (err) {
        console.log((`💩 ${red.underline.bold("=> There was an error while copying files =>")} ${orange(err)}`));
    }
    finally {
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
async function editJson(filePath, keys, values) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        let jsonData;
        try {
            jsonData = JSON.parse(data);
        }
        catch (parseError) {
            console.log((`💩 ${red.underline.bold("=> Error parsing JSON =>")} ${orange(parseError)}`));
            return;
        }
        for (const key of keys) {
            const index = keys.indexOf(key);
            const value = values[index];
            jsonData[key] = value;
        }
        const updatedJsonData = JSON.stringify(jsonData, null, 2);
        await fs.writeFile(filePath, updatedJsonData, 'utf8');
    }
    catch (err) {
        console.log((`💩 ${red.underline.bold("=> Error editing JSON Data =>")} ${orange(err)}`));
    }
    finally {
        console.log("🐕" + blue.underline(` => Updated file ${orange(filePath)}`));
    }
}
async function stringReplace(filePath, keys, values) {
    try {
        let modifiedContent = '';
        const data = await fs.readFile(filePath, 'utf8');
        for (const key of keys) {
            const index = keys.indexOf(key);
            const value = values[index];
            const regex = new RegExp(`${key}`, 'g');
            modifiedContent = data.replace(regex, `${value}`);
        }
        await fs.writeFile(filePath, modifiedContent, 'utf8');
    }
    catch (err) {
        console.log((`💩 ${red.underline.bold("=> During string replace =>")} ${orange(err)}`));
    }
    finally {
        console.log(blue.underline(`🐕 => Updated file ${orange(filePath)}`));
    }
}
async function installPackages(wixPackages, devPackages, cwd) {
    const wixPackageNames = Object.keys(wixPackages);
    const devPackageNames = Object.keys(devPackages);
    const devPackageVersions = Object.values(devPackages);
    const devPackageNamesAndVersions = devPackageNames.map((name, index) => `${name}@${devPackageVersions[index]}`);
    let success = true;
    wixPackageNames.forEach((name, index) => {
        console.log(`🐕 => Installing ${orange(name)}`);
        const wixInstall = `wix install ${name}`;
        const wixres = spawnSync(wixInstall, { shell: true, stdio: 'inherit' });
        if (wixres.error) {
            console.log((`💩 ${red.underline.bold("=> Failed to install package =>")} ${orange(wixres.error.message)}`));
            success = false;
        }
        else {
            console.log("🐕" + blue.underline(` => Package installed!`));
        }
    });
    const yarnAdd = `yarn add -D ${devPackageNamesAndVersions.join(' ')}`;
    const yarnRes = spawnSync(yarnAdd, { shell: true, stdio: 'inherit' });
    if (yarnRes.error) {
        success = false;
        console.log((`💩 ${red.underline.bold("=> Failed to install dev packages =>")} ${orange(yarnRes.error.message)}`));
    }
    if (success) {
        await fs.writeFile(join(cwd, 'wixpkgs.json'), JSON.stringify(wixPackages, null, 2), 'utf8');
        console.log("🐕" + blue.underline(` => All Packages installed!`));
    }
    else {
        console.log("🐕" + red.underline(` => Some packages failed to install!`));
    }
}
async function gitInit(cwd, modules) {
    const git = simpleGit({ baseDir: cwd });
    for (const [name, url] of Object.entries(modules)) {
        console.log(chalk.green.underline.bold(`Cloning ${name}`));
        try {
            await git.submoduleAdd(url, name);
        }
        catch (err) {
            console.log((`💩 ${red.underline.bold("=> Command failed =>")} ${orange(err)}`));
        }
        finally {
            console.log("🐕" + blue.underline(` => Cloned ${orange(name)}`));
        }
    }
    console.log("🐶" + green.underline(' => All Modules cloned!'));
}

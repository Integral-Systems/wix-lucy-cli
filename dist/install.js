import chalk from 'chalk';
import { join } from 'path';
import { simpleGit } from 'simple-git';
import fs from 'fs/promises';
import { spawnSync } from 'child_process';
export async function installPackages(wixPackages, devPackages, cwd) {
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
export async function gitInit(cwd, modules) {
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

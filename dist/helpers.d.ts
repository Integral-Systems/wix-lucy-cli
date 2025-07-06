import { LucySettings, ModuleSettings, ProjectSettings } from '.';
export declare function installPackages(wixPackages: Record<string, string>, devPackages: Record<string, string>, cwd: string, locked: boolean): Promise<void>;
export declare function gitInit(cwd: string, modules: LucySettings['modules']): Promise<void>;
export declare function runGulp(moduleSettings: ModuleSettings, projectSettings: ProjectSettings, task: string): Promise<void>;
/**
 * Clean up and run a command before exiting the process.
 */
export declare function cleanupWatchers(): void;
/**
 * Kill all processes matching a specific substring in their command, with a fallback for Windows.
 * @param {string} processPattern - The substring to match (e.g., "wix:dev" or "@wix/cli/bin/wix.cjs").
 */
export declare function killAllProcesses(processPattern: string): void;
export interface VeloSyncConfig {
    siteUrl: string;
    secret: string;
}
export declare function saveConfig(config: VeloSyncConfig, file: string): Promise<void>;
export declare function readConfig(file: string): Promise<VeloSyncConfig>;
export declare function createTemplateFolder(moduleSettings: ModuleSettings): Promise<void>;
export type PackageJson = {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    [key: string]: any;
};
/**
 * Updates a lucy.json file with dependencies from a package.json file.
 * It replaces 'wixPackages' with 'dependencies' and 'devPackages' with 'devDependencies'.
 * @param {string} packageJsonPath - Path to the package.json file.
 * @param {string} lucyConfigPath - Path to the lucy.json file.
 */
export declare function updateLucyConfigFromPackageJson(packageJsonPath: string, lucyConfigPath: string): Promise<void>;

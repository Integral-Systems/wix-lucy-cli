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

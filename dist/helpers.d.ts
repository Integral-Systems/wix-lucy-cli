import { ModuleSettings, ProjectSettings } from '.';
export declare function installPackages(wixPackages: Record<string, string>, devPackages: Record<string, string>, cwd: string, locked: boolean): Promise<void>;
export declare function gitInit(cwd: string, modules: Record<string, string>): Promise<void>;
export declare function dev(moduleSettings: ModuleSettings, projectSettings: ProjectSettings, task: string): Promise<void>;

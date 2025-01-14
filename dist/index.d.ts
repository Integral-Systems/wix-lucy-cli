#!/usr/bin/env node --no-warnings
export type LucySettings = {
    modules: {
        [llibName: string]: {
            url: string;
            branch: string;
        };
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
    settings: LucySettings;
    lockVersion: boolean;
    force: boolean;
    veloConfigName: string;
};
export type ProjectSettings = {
    modules?: Record<string, string>;
    lucySettings?: LucySettings;
    packageJSON?: Record<string, any>;
};
export declare const orange: import("chalk").ChalkInstance;
export declare const blue: import("chalk").ChalkInstance;
export declare const green: import("chalk").ChalkInstance;
export declare const red: import("chalk").ChalkInstance;
export declare const yellow: import("chalk").ChalkInstance;
export declare const magenta: import("chalk").ChalkInstance;

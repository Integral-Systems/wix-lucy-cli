#!/usr/bin/env node --no-warnings
import settings from './settings.json';
import lucyJSON from '../files/lucy.json';
export type LucySettings = {
    modules: {
        [llibName: string]: string;
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
    settings: typeof settings;
    lucyJSON: typeof lucyJSON;
    lockVersion: boolean;
};
export type ProjectSettings = {
    modules?: Record<string, string>;
    lucySettings?: LucySettings;
    packageJSON?: Record<string, any>;
    lucyJSON?: Record<string, any>;
    force: boolean;
};
export declare const orange: import("chalk").ChalkInstance;
export declare const blue: import("chalk").ChalkInstance;
export declare const green: import("chalk").ChalkInstance;
export declare const red: import("chalk").ChalkInstance;
export declare const yellow: import("chalk").ChalkInstance;
export declare const magenta: import("chalk").ChalkInstance;

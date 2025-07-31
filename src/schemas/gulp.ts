import { LucySettings } from "./lucy";
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';

const sass = gulpSass(dartSass);

export type ModuleSettings = {
    packageRoot: string;
    targetFolder: string;
    wixConfigPath: string;
    lucyConfigPath: string;
    packageJsonPath: string;
    settings: LucySettings;
    force: boolean;
    veloConfigName: string;
}

export type ProjectSettings = {
    // packages?: Record<string, string>;
    modules?: Record<string, any>;
    lucySettings?: LucySettings;
    packageJSON?: Record<string, any>;
}
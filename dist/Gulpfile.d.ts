import gulpSass from 'gulp-sass';
import backendSettings from '../settings/backend-settings.json';
import masterSettings from '../settings/master-settings.json';
import pageSettings from '../settings/page-settings.json';
import publicSettings from '../settings/public-settings.json';
import { ModuleSettings, ProjectSettings } from './schemas/gulp.js';
import { LucyConfig } from './config.js';
export type TaskOptions = {
    moduleSettings?: ModuleSettings;
    projectSettings?: ProjectSettings;
    enableIncrementalBuild: boolean;
    outputDir: string;
    sass: ReturnType<typeof gulpSass>;
    userHomeDir: string;
    replaceOptions: typeof replaceOptions;
    backendSettings: typeof backendSettings;
    masterSettings: typeof masterSettings;
    pageSettings: typeof pageSettings;
    publicSettings: typeof publicSettings;
    modulesSourcePaths: string[];
    cwd: string;
    isWatching?: boolean;
};
export interface File {
    path: string;
    dirname: string;
}
declare const replaceOptions: {
    logs: {
        enabled: boolean;
    };
};
export declare const taskOptions: TaskOptions;
export declare function runTask(config: LucyConfig): Promise<void>;
export {};

import gulpSass from 'gulp-sass';
import backendSettings from '../../settings/backend-settings.json';
import masterSettings from '../../settings/master-settings.json';
import pageSettings from '../../settings/page-settings.json';
import publicSettings from '../../settings/public-settings.json';
export type TaskOptions = {
    enableIncrementalBuild: boolean;
    outputDir: string;
    sass: ReturnType<typeof gulpSass>;
    replaceOptions: {
        logs: {
            enabled: boolean;
        };
    };
    backendSettings: typeof backendSettings;
    masterSettings: typeof masterSettings;
    pageSettings: typeof pageSettings;
    publicSettings: typeof publicSettings;
    modulesSourcePaths: string[];
    cwd: string;
};
export interface File {
    path: string;
    dirname: string;
}

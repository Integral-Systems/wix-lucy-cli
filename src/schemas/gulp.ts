import { LucySettings } from "./lucy";
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import backendSettings from '../../settings/backend-settings.json' with { type: "json" };;
import masterSettings from '../../settings/master-settings.json' with { type: "json" };;
import pageSettings from '../../settings/page-settings.json' with { type: "json" };;
import publicSettings from '../../settings/public-settings.json' with { type: "json" };;

const sass = gulpSass(dartSass);

export type TaskOptions = {
    enableIncrementalBuild: boolean;
    outputDir: string;
    sass: ReturnType<typeof gulpSass>;
    replaceOptions: {
        logs: {
            enabled: boolean;
        }
    };
    backendSettings: typeof backendSettings,
    masterSettings: typeof masterSettings,
    pageSettings: typeof pageSettings,
    publicSettings: typeof publicSettings,
    modulesSourcePaths: string[];
    cwd: string;
    isWatching?: boolean;
}

export interface File {
	path: string;
	dirname: string;
}

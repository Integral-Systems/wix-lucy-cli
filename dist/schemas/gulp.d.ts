import { LucySettings } from "./lucy";
export type ModuleSettings = {
    packageRoot: string;
    targetFolder: string;
    wixConfigPath: string;
    lucyConfigPath: string;
    packageJsonPath: string;
    settings: LucySettings;
    force: boolean;
    veloConfigName: string;
};
export type ProjectSettings = {
    modules?: Record<string, any>;
    lucySettings?: LucySettings;
    packageJSON?: Record<string, any>;
};

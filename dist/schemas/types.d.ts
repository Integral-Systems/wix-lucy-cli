export declare const initTypes: readonly ["velo", "expo", "blocks", "monorepo", "tauri", "cargo", "submodules", "wix-sdk"];
export declare const taskNames: readonly ["dev", "build", "build-prod", "build-pipeline", "sync-settings"];
export declare const syncActions: readonly ["sync", "import", "init", "is-alive", "migrate", "export"];
export declare const WixSDKActions: readonly ["init", ""];
export type Action = 'init' | 'open' | 'task' | 'wix-sync';
import gulp from 'gulp';
export type SyncTaskType = (filename: string, collection: string, schemaFilename: string, importOnly: boolean, dryrun: boolean) => Promise<void>;
export type MigrateFileCache = () => Promise<void>;
export type TaskType = ReturnType<typeof gulp.parallel>;
export type Actions = {
    action: Action;
    initType?: typeof initTypes[number];
    tasksName?: typeof taskNames[number];
    syncAction?: typeof syncActions[number];
    wixSDKAction?: typeof WixSDKActions[number];
};
export interface LucyArgs {
    [x: string]: unknown;
    _: Action[];
    $0: string;
    initType?: Actions['initType'];
    tasksName?: Actions['tasksName'];
    syncAction?: Actions['syncAction'];
    wixSDKAction?: Actions['wixSDKAction'];
    input?: string;
    collection?: string;
    schema?: string;
    d?: boolean;
}
export interface VeloSyncConfig {
    siteUrl: string;
    secret: string;
}

export declare const initTypes: readonly ["velo", "expo", "blocks", "monorepo", "tauri", "cargo", "submodules", "wix-sdk"];
export declare const taskNames: readonly ["dev", "build", "build-prod", "build-pipeline", "sync-settings"];
export declare const syncActions: readonly ["sync", "import", "init", "is-alive"];
export declare const WixSDKActions: readonly ["init", ""];
export type Action = 'init' | 'open' | 'task' | 'wix-sync';
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
    file?: string;
    collection?: string;
    schema?: string;
    dry?: boolean;
}
export interface VeloSyncConfig {
    siteUrl: string;
    secret: string;
}

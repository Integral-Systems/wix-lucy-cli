export const initTypes = ["velo", "expo", "blocks", "monorepo", "tauri", "cargo", 'submodules', 'wix-sdk'] as const;
export const taskNames = ["dev", "build", "build-prod", "build-pipeline", "sync-settings"] as const;
export const syncActions = ["sync", "import", "init", "is-alive"] as const;
export const WixSDKActions = ["init", ""] as const;
export type Action = 'init' | 'open' | 'task' | 'wix-sync';

export type Actions = {
    action: Action;
    initType?: typeof initTypes[number];
    tasksName?: typeof taskNames[number];
    syncAction?: typeof syncActions[number];
    wixSDKAction?: typeof WixSDKActions[number];
}

export interface LucyArgs {
    [x: string]: unknown;
    // This will hold the command used, e.g., 'init'
    _: Action[];
    $0: string;
    // Arguments for the 'init' command
    initType?: Actions['initType'];
    tasksName?: Actions['tasksName'];
    syncAction?: Actions['syncAction'];
    wixSDKAction?: Actions['wixSDKAction'];
    // wix-sync options
    file?: string;        // Alias for -f
    collection?: string;  // Alias for -c
    schema?: string;      // Alias for -s
    dry?: boolean;    
}

export interface VeloSyncConfig {
    siteUrl: string;
    secret: string;
}
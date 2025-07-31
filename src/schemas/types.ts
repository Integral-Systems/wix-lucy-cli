export const types = ["velo", "expo", "blocks", "monorepo", "tauri", "cargo", 'submodules'] as const;
export const tasks = ["dev"] as const;

export type Action = 'init' | 'open' | 'task';

export type Actions = {
    action: Action;
    type?: typeof types[number];
    task?: typeof tasks[number];
}

export interface LucyArgs {
    [x: string]: unknown;
    // This will hold the command used, e.g., 'init'
    _: Action[];
    $0: string;
    // Arguments for the 'init' command
    type?: Actions['type'];
    task?: Actions['task'];
}

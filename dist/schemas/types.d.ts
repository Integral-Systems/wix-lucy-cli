export declare const types: readonly ["velo", "expo", "blocks", "monorepo", "tauri", "cargo", "submodules"];
export declare const tasks: readonly ["dev", "build", "build-prod", "build-pipeline"];
export type Action = 'init' | 'open' | 'task';
export type Actions = {
    action: Action;
    type?: typeof types[number];
    task?: typeof tasks[number];
};
export interface LucyArgs {
    [x: string]: unknown;
    _: Action[];
    $0: string;
    type?: Actions['type'];
    task?: Actions['task'];
}

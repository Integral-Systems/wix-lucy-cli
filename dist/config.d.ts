import { Context, Layer } from "effect";
import { get_args } from "./args.js";
import { LucySettings } from "./schemas/lucy.js";
type Action = 'init';
type Actions = {
    action: Action;
    type: 'velo' | 'expo' | 'blocks' | 'monorepo' | 'tauri' | 'cargo' | undefined;
};
declare const Config_base: Context.TagClass<Config, "Config", {
    readonly config: {
        readonly action: Actions;
        readonly force: boolean;
        readonly cwd: string;
        readonly packageRoot: string;
        readonly filesFolder: string;
        packageJson: any;
        lucySettings: LucySettings;
        readonly lucyHome: string;
        templateDir: string;
        templateFiles: string;
        projectName: string;
    };
}>;
export declare class Config extends Config_base {
}
export declare const ConfigLayer: (args: Awaited<ReturnType<typeof get_args>>) => Layer.Layer<Config, never, never>;
export {};

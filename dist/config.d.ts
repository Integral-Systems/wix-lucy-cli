import { Context, Layer } from "effect";
import { get_args } from "./args.js";
type Action = 'init';
type Actions = {
    action: Action;
    type: 'velo' | 'expo' | 'blocks' | undefined;
};
declare const Config_base: Context.TagClass<Config, "Config", {
    readonly config: {
        readonly action: Actions;
        readonly cwd: string;
        readonly packageRoot: string;
        readonly filesFolder: string;
        readonly packageJson: any;
    };
}>;
export declare class Config extends Config_base {
}
export declare const ConfigLayer: (args: Awaited<ReturnType<typeof get_args>>) => Layer.Layer<Config, never, never>;
export {};

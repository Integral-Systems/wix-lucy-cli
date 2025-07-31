import { Context, Layer, Schema } from "effect"
import { get_args } from "./args.js";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { readFileSync, existsSync } from "fs";
import { lucySettings, LucySettings } from "./schemas/lucy.js";
import { logger } from "./utils/logger.js";
import os from 'os';
import { Action, Actions } from "./schemas/types.js";

export class Config extends Context.Tag("Config")<
    Config,
    {
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
            defaultModuleBasePath: string;
        }
    }
>() {}

// or, if you want just the inner config object:
export type LucyConfig = typeof Config.Service["config"];

// In an ES module, `__dirname` is not available by default.
// We can replicate it using `import.meta.url`.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Assuming your compiled output is in a 'dist' folder at the project root,
// and your source `config.ts` is in `src`, the running `config.js` will be
// in something like `dist/src`. To get to the package root, we go up two levels.
const packageRoot = join(__dirname, "..");

export const ConfigLayer = (args: Awaited<ReturnType<typeof get_args>>) => {
    let packageJson = '{}';
    let lucyJson: LucySettings | undefined = undefined;
    const packageJsonPath = join(process.cwd(), 'package.json');
    const lucyJsonPath = join(process.cwd(), 'lucy.json');
    try {
        if (existsSync(packageJsonPath)) {
            const raw = readFileSync(packageJsonPath, 'utf-8');
            packageJson = JSON.parse(raw);
        }
    } catch (error) {
        logger.error("Error reading package.json:", error);
    }
    try {
        if (existsSync(lucyJsonPath)) {
            const raw = readFileSync(lucyJsonPath, 'utf-8');
            lucyJson = Schema.decodeUnknownSync(lucySettings)(JSON.parse(raw));
        }
    } catch (error) {
        logger.error("Error reading lucy.json:", error);
    }
    const defaultModulePath = () => {
        if (args.type === 'monorepo') {
            return join('packages');
        }
        return '';
    }
    return Layer.succeed(
        Config,
        Config.of({
            config: {
                action: {
                    type: args.type,
                    action: args._[0],
                    task: args.task,
                },
                force: args.force === true ? true : false,
                cwd: process.cwd(),
                projectName: process.cwd().split('/').pop() || 'lucy-project',
                packageRoot: packageRoot,
                filesFolder: join(packageRoot, 'files'),
                packageJson,
                lucyHome: join(os.homedir(), '.lucy-cli'),
                lucySettings: lucyJson || {
                    modules: {},
                    devDependencies: {},
                    dependencies: {},
                    scripts: {},
                    initialized: false,
                    type: args.type || 'velo',
                },
                templateFiles: '',
                templateDir: '',
                defaultModuleBasePath: defaultModulePath(),
            }
        })
    );
}

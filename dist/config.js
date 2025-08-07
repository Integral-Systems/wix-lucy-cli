import { Context, Effect, Layer, Schema } from "effect";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { lucySettings } from "./schemas/lucy.js";
import os from 'os';
import { JsonSchema, veloSyncSettings, wixSDKSettings } from "./schemas/index.js";
import { FileSystem, Path } from "@effect/platform";
import { NodeContext } from "@effect/platform-node/index";
export class Config extends Context.Tag("Config")() {
}
// In an ES module, `__dirname` is not available by default.
// We can replicate it using `import.meta.url`.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageRoot = join(__dirname, "..");
export const packageJsonName = "package.json";
export const lucyJsonName = "lucy.json";
export const wixSyncJsonName = "wix-sync.json";
export const wixSDKSettingsJsonName = "wix-sdk-settings.json";
export const syncDataName = 'sync-data';
export const packageJsonPath = join(process.cwd(), packageJsonName);
export const lucyJsonPath = join(process.cwd(), lucyJsonName);
export const veloSyncJsonPath = join(process.cwd(), wixSyncJsonName);
export const wixSDKSettingsJsonPath = join(process.cwd(), wixSDKSettingsJsonName);
export const syncFilesSource = join(packageRoot, 'files', syncDataName);
export const ConfigLayer = (args) => {
    return Layer.effect(Config, Effect.gen(function* () {
        const fs = yield* FileSystem.FileSystem;
        const path = yield* Path.Path;
        let packageJson = {};
        let lucyJson = undefined;
        let veloSyncJson = undefined;
        let wixSDKSettingsJson = undefined;
        // Read package.json
        if (yield* fs.exists(packageJsonPath)) {
            const raw = yield* fs.readFileString(packageJsonPath, 'utf-8');
            packageJson = yield* Schema.decodeUnknown(JsonSchema)(raw);
        }
        // Read lucy.json
        if (yield* fs.exists(lucyJsonPath)) {
            const raw = yield* fs.readFileString(lucyJsonPath, 'utf-8');
            const lucyJsonRaw = yield* Schema.decodeUnknown(JsonSchema)(raw);
            lucyJson = yield* Schema.decodeUnknown(lucySettings)(lucyJsonRaw);
        }
        // Read wix-sync.json
        if (yield* fs.exists(veloSyncJsonPath)) {
            const raw = yield* fs.readFileString(veloSyncJsonPath, 'utf-8');
            const veloSyncSettingsRaw = yield* Schema.decodeUnknown(JsonSchema)(raw);
            veloSyncJson = yield* Schema.decodeUnknown(veloSyncSettings)(veloSyncSettingsRaw);
        }
        // Read wix-sdk-settings.json
        if (yield* fs.exists(wixSDKSettingsJsonPath)) {
            const raw = yield* fs.readFileString(wixSDKSettingsJsonPath, 'utf-8');
            const wixSDKSettingsRaw = yield* Schema.decodeUnknown(JsonSchema)(raw);
            wixSDKSettingsJson = yield* Schema.decodeUnknown(wixSDKSettings)(wixSDKSettingsRaw);
        }
        const defaultModulePath = () => {
            if (args.type === 'monorepo') {
                return 'packages';
            }
            return '';
        };
        return Config.of({
            config: {
                action: {
                    initType: args.initType,
                    action: args._[0],
                    tasksName: args.tasksName,
                    syncAction: args.syncAction,
                    wixSDKAction: args.wixSDKAction,
                },
                force: args.force === true ? true : false,
                cwd: process.cwd(),
                projectName: process.cwd().split('/').pop() || 'lucy-project',
                packageRoot,
                filesFolder: join(packageRoot, 'files'),
                packageJson,
                lucyHome: join(os.homedir(), '.lucy-cli'),
                veloSyncSettings: veloSyncJson,
                veloSyncArguments: {
                    data: path.join(process.cwd(), args.input || ''),
                    collection: args.collection,
                    schema: path.join(process.cwd(), args.schema || ''),
                    dry: args.d || false,
                },
                wixSDKSettings: wixSDKSettingsJson,
                lucySettings: lucyJson || {
                    modules: {},
                    devDependencies: {},
                    dependencies: {},
                    scripts: {},
                    initialized: false,
                    type: args.initType || 'velo',
                    packageManager: 'npm',
                    defaultModulePath: ''
                },
                templateFiles: '',
                templateDir: '',
            }
        });
    }).pipe(Effect.provide(NodeContext.layer)));
};
//# sourceMappingURL=config.js.map
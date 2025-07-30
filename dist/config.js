import { Context, Layer, Schema } from "effect";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { readFileSync, existsSync } from "fs";
import { lucySettings } from "./schemas/lucy.js";
import { logger } from "./utils/logger.js";
import os from 'os';
export class Config extends Context.Tag("Config")() {
}
// In an ES module, `__dirname` is not available by default.
// We can replicate it using `import.meta.url`.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Assuming your compiled output is in a 'dist' folder at the project root,
// and your source `config.ts` is in `src`, the running `config.js` will be
// in something like `dist/src`. To get to the package root, we go up two levels.
const packageRoot = join(__dirname, "..");
export const ConfigLayer = (args) => {
    let packageJson = '{}';
    let lucyJson = undefined;
    const packageJsonPath = join(process.cwd(), 'package.json');
    const lucyJsonPath = join(process.cwd(), 'lucy.json');
    try {
        if (existsSync(packageJsonPath)) {
            const raw = readFileSync(packageJsonPath, 'utf-8');
            packageJson = JSON.parse(raw);
        }
    }
    catch (error) {
        logger.error("Error reading package.json:", error);
    }
    try {
        if (existsSync(lucyJsonPath)) {
            const raw = readFileSync(lucyJsonPath, 'utf-8');
            lucyJson = Schema.decodeUnknownSync(lucySettings)(JSON.parse(raw));
        }
    }
    catch (error) {
        logger.error("Error reading lucy.json:", error);
    }
    return Layer.succeed(Config, Config.of({
        config: {
            action: {
                type: args.type,
                action: args._[0]
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
                // veloSettings: null,
                devDependencies: {},
                dependencies: {},
                scripts: {},
                initialized: false,
                type: args.type || 'velo',
            },
            templateFiles: '',
            templateDir: ''
        }
    }));
};
//# sourceMappingURL=config.js.map
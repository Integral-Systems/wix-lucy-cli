import { Context, Layer } from "effect";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { readFileSync, existsSync } from "fs";
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
    const packageJsonPath = join(process.cwd(), 'package.json');
    try {
        if (existsSync(packageJsonPath)) {
            const raw = readFileSync(packageJsonPath, 'utf-8');
            packageJson = JSON.parse(raw);
        }
    }
    catch (error) {
        console.error("Error reading package.json:", error);
    }
    return Layer.succeed(Config, Config.of({
        config: {
            action: {
                type: args.type,
                action: args._[0]
            },
            cwd: process.cwd(),
            packageRoot: packageRoot,
            filesFolder: join(packageRoot, 'files'),
            packageJson
        }
    }));
};

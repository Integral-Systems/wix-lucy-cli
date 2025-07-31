import { Effect } from 'effect/index';
import { Config } from '../../config.js';
export const getModulesSourcePaths = Effect.gen(function* () {
    const config = yield* Config;
    const data = config.config.lucySettings.modules;
    const paths = [];
    for (const module of Object.keys(data)) {
        if (!data[module].noCompile) {
            if (data[module].path) {
                paths.push(data[module].path);
            }
            else {
                paths.push(module);
            }
        }
    }
    return paths;
});
//# sourceMappingURL=helpers.js.map
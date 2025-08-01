import { Effect } from "effect/index";
import { Config } from "../config.js";
import { AppError } from "../error.js";
import { task_runGulp } from "./Gulpfile.js";
import { task_syncSettings } from "./syncSettings.js";
import { setNeedsCleanup } from "../index.js";
export const tasks = () => {
    return Effect.gen(function* (_) {
        const config = yield* Config;
        if (config.config.action.task === undefined) {
            return yield* Effect.fail(new AppError({ message: "No action task provided", cause: new Error("No action task provided") }));
        }
        if (config.config.action.task === 'dev'
            || config.config.action.task === 'build'
            || config.config.action.task === 'build-prod'
            || config.config.action.task === 'build-pipeline') {
            setNeedsCleanup(true);
            return yield* task_runGulp;
        }
        if (config.config.action.task === 'sync-settings')
            return yield* task_syncSettings;
        yield* Effect.fail(new AppError({ message: `Unsupported action type: ${config.config.action.type}`, cause: new Error(`Unsupported action type: ${config.config.action.type}`) }));
    });
};
//# sourceMappingURL=index.js.map
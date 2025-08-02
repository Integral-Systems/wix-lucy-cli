import { Effect, Schema } from "effect/index"
import { Config } from "../config.js";
import { AppError } from "../error.js";
import { task_runGulp } from "./Gulpfile.js";
import { task_syncSettings } from "./syncSettings.js";
import { setNeedsCleanup } from "../index.js";


export const tasks = Effect.gen(function* (_) {
    const config = yield* Config;
    if(config.config.action.tasksName === undefined) {
        return yield* Effect.fail(new AppError({ message: "No task name provided", cause: new Error("No task name provided") }));
    }
    if(
        config.config.action.tasksName === 'dev' 
        || config.config.action.tasksName === 'build' 
        || config.config.action.tasksName === 'build-prod'
        || config.config.action.tasksName === 'build-pipeline'
    ) 
    {
        setNeedsCleanup(true);
        return yield* task_runGulp;
    }
    if(config.config.action.tasksName === 'sync-settings') return yield* task_syncSettings;
    yield* Effect.fail(new AppError({ message: `Unsupported task type: ${config.config.action.tasksName}`, cause: new Error(`Unsupported task type: ${config.config.action.tasksName}`) }));
})

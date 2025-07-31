import { Effect, Schema } from "effect/index"
import { Config } from "../config.js";
import Enquirer from "enquirer";
import { AppError } from "../error.js";
import { createLucyHome } from "../commands/home.js";
import { readLucyJsonFromTemplate } from "../commands/read.js";
import { runTask } from "./Gulpfile.js";


export const tasks = () => {
    return Effect.gen(function* (_) {
        const config = yield* Config;
        if(config.config.action.task === undefined) {
            return yield* Effect.fail(new AppError({ message: "No action task provided", cause: new Error("No action task provided") }));
        }

        if(config.config.action.task === 'dev') {
            return yield* Effect.tryPromise({
                try: () => runTask(config.config),
                catch: (err: any) => {
                    return new AppError({ message: err.message, cause: err });
                }
            });
        }
        yield* Effect.fail(new AppError({ message: `Unsupported action type: ${config.config.action.type}`, cause: new Error(`Unsupported action type: ${config.config.action.type}`) }));
    })
}
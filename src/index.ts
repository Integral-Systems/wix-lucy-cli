#!/usr/bin/env node
import { Chunk, Duration, Effect, pipe, Schedule, Array, Ref } from "effect";
import { build_runtime } from "./runtime.js";
import { get_args } from "./args.js";
import 'dotenv/config'
import { Config } from "./config.js";
import { ServiceInspectState } from "./states.js";
import { init } from "./init/index.js";
import { logger } from "./utils/logger.js";
import { AppError } from "./error.js";


const lucyCLI = pipe(
    Effect.gen(function* (_) {
        const config = yield* Config; 
        config.config.action.type;
        if (config.config.action.type === undefined) {
            return yield* Effect.fail(new AppError({ message: "No action type provided", cause: new Error("No action type provided") }));
        }
        if (config.config.action.action === 'init') {
            return yield* init();
        }
    }),
).pipe(
    Effect.catchTags({
        BadArgument: (error) => {
            logger.error(JSON.stringify(error, null, 2));
            return Effect.fail(new Error(error.message));
        },
        ParseError: (error) => {
            logger.error("Failed to parse:", JSON.stringify(error, null, 2));
            return Effect.fail(new Error("Failed to parse: " + error.message));
        },
        SystemError: (error) => {
            logger.error("System error:", JSON.stringify(error, null, 2));
            return Effect.fail(new Error("System error: " + error.message));
        },   
        AppError: (error) => {
            logger.error("Application error:", JSON.stringify(error, null, 2));
            return Effect.fail(new Error("Application error: " + error.message));
        }
    })
)

async function main() {
    const args = await get_args();
    const runtime= build_runtime(args);
    // The runtime will handle logging failures. This will catch unhandled defects.
    const program = Effect.orDieWith(
        lucyCLI,
        (error) => new Error(`The application failed to run: ${error}`
        )
)
    await runtime.runPromise(program)
}

main().then(() => {
    process.exit(0);
}).catch((error) => {
    if (error instanceof Error) {
        logger.error(error.message);
        console.debug(JSON.stringify(error, null, 2));
    }
    process.exit(1);
});
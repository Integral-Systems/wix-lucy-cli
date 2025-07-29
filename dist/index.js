#!/usr/bin/env node
import { Effect, pipe } from "effect";
import { build_runtime } from "./runtime.js";
import { get_args } from "./args.js";
import 'dotenv/config';
import { Config } from "./config.js";
import { init } from "./init/index.js";
const lucyCLI = pipe(Effect.gen(function* (_) {
    const config = yield* Config;
    config.config.action.type;
    if (config.config.action.type === undefined) {
        return yield* Effect.fail("No Params Provided");
    }
    if (config.config.action.action === 'init') {
        return yield* init();
    }
}));
async function main() {
    const args = await get_args();
    const runtime = build_runtime(args);
    // The runtime will handle logging failures. This will catch unhandled defects.
    await runtime.runPromise(lucyCLI);
}
main().catch((error) => {
    console.error("An unexpected application error occurred:", error);
    process.exit(1);
});

#!/usr/bin/env node
import { Effect, pipe } from "effect";
import { build_runtime } from "./runtime.js";
import { get_args } from "./args.js";
import 'dotenv/config';
import { Config } from "./config.js";
import { init } from "./init/index.js";
import { logger } from "./utils/logger.js";
import { open } from "./commands/exec.js";
import { tasks } from "./tasks/index.js";
import { cleanupWatchers, killAllProcesses } from "./helpers.js";
let exitReason = 'none';
let needsCleanup = false;
export function setNeedsCleanup(value) {
    needsCleanup = value;
}
process.on('exit', (code) => {
    if (!needsCleanup)
        return;
    if (exitReason === 'none') {
        killAllProcesses('@wix/cli/bin/wix.cjs'); // Matches processes running the Wix CLI
        killAllProcesses('wix:dev');
        cleanupWatchers();
    }
    logger.info(`🛑 Process exited with code: ${code}`);
});
process.on('SIGINT', () => {
    exitReason = "SIGINT";
    logger.info(`🐕 Received Ctrl+C (SIGINT), cleaning up...`);
    killAllProcesses('@wix/cli/bin/wix.cjs'); // Matches processes running the Wix CLI
    killAllProcesses('wix:dev');
    cleanupWatchers();
    process.exit(); // Exit explicitly after handling
});
process.on('SIGTERM', () => {
    exitReason = "SIGTERM";
    logger.info(`🛑 Received termination signal (SIGTERM), cleaning up...`);
    killAllProcesses('@wix/cli/bin/wix.cjs'); // Matches processes running the Wix CLI
    killAllProcesses('wix:dev');
    cleanupWatchers();
    process.exit(); // Exit explicitly after handling
});
const lucyCLI = pipe(Effect.gen(function* (_) {
    const config = yield* Config;
    const t = Config;
    config.config.action.type;
    if (config.config.action.action === 'init') {
        return yield* init();
    }
    if (config.config.action.action === 'open') {
        return yield* open;
    }
    if (config.config.action.action === 'task') {
        return yield* tasks();
    }
})).pipe(Effect.catchTags({
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
}));
async function main() {
    const args = await get_args();
    const runtime = build_runtime(args);
    // The runtime will handle logging failures. This will catch unhandled defects.
    const program = Effect.orDieWith(lucyCLI, (error) => new Error(`The application failed to run: ${error}`));
    await runtime.runPromise(program);
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
//# sourceMappingURL=index.js.map
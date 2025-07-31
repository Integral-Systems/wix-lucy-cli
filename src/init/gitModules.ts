import { Effect } from "effect/index"
import { logger } from "../utils/logger.js";
import { setInitialized } from "../commands/edit.js";
import { gitInit } from "../commands/git.js";

export const init_submodules = () => {
    return Effect.gen(function*() {
        logger.action("Initializing Git submodules project...");

        yield* gitInit(true);
        yield* setInitialized;
        
        logger.success("GIT initialized successfully!");
    })
}

import { Effect } from "effect/index";
import { logger } from "../utils/logger.js";
import { writeLucySettings } from "../commands/write.js";
import { copyTemplateFiles } from "../commands/copy.js";
import { gitInit } from "../commands/git.js";
import { checkForDirty } from "../commands/checks.js";
export const init_cargo = () => {
    return Effect.gen(function* () {
        logger.action("Initializing Cargo project...");
        yield* checkForDirty();
        yield* copyTemplateFiles;
        yield* writeLucySettings;
        yield* gitInit;
    });
};
//# sourceMappingURL=cargo%20copy.js.map
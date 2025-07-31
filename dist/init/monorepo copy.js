import { Effect } from "effect/index";
import { logger } from "../utils/logger.js";
import { mergeAdditions, mergeLucySettings2PackageJson, setProjectName } from "../commands/edit.js";
import { writeLucySettings, writePackageJson } from "../commands/write.js";
import { copyTemplateFiles } from "../commands/copy.js";
import { readPackageJson } from "../commands/read.js";
import { runYarn, yarnSetVersion } from "../commands/install.js";
import { cleanup } from "../commands/cleanup.js";
import { gitInit } from "../commands/git.js";
import { checkForDirty } from "../commands/checks.js";
export const init_monorepo = () => {
    return Effect.gen(function* () {
        logger.action("Initializing monorepo...");
        yield* checkForDirty();
        yield* copyTemplateFiles;
        yield* readPackageJson;
        yield* setProjectName;
        yield* mergeLucySettings2PackageJson;
        yield* mergeAdditions;
        yield* writeLucySettings;
        yield* writePackageJson;
        yield* gitInit;
        yield* yarnSetVersion;
        yield* runYarn;
        yield* cleanup;
    });
};
//# sourceMappingURL=monorepo%20copy.js.map
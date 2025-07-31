import { Effect, Schema } from "effect/index"
import { Config } from "../config.js";
import { FileSystem, Path } from "@effect/platform"
import { logger } from "../utils/logger.js";
import { mergeAdditions, mergeLucySettings2PackageJson, setInitialized, setProjectName, stringReplace } from "../commands/edit.js";
import { writeLucySettings, writePackageJson } from "../commands/write.js";
import { copyTemplateFiles } from "../commands/copy.js";
import { readPackageJson } from "../commands/read.js";
import { runYarn, yarnSetVersion } from "../commands/install.js";
import { cleanup } from "../commands/cleanup.js";
import { gitInit } from "../commands/git.js";
import { checkForDirty } from "../commands/checks.js";

export const init_monorepo = () => {
    return Effect.gen(function*() {
        const config = yield* Config;
        const path = yield* Path.Path;

        logger.action("Initializing monorepo...");

        yield* checkForDirty();

        yield* copyTemplateFiles;
        yield* stringReplace(path.join(config.config.cwd, 'currents.config.ts'), ['__ProjectName__'], [config.config.projectName]);
        yield* readPackageJson;
        yield* setProjectName;
        yield* mergeLucySettings2PackageJson;
        yield* mergeAdditions;
        yield* writeLucySettings;
        yield* writePackageJson;
        yield* gitInit();
        yield* yarnSetVersion;
        yield* runYarn;
        yield* cleanup;
        yield* setInitialized;
        
        logger.success("Monorepo initialized successfully!");
    })
}

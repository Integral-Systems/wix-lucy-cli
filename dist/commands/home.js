import { Effect } from "effect/index";
import { Config } from "../config.js";
import { FileSystem } from "@effect/platform";
import { logger, orange } from "../utils/logger.js";
import path from 'path';
export const createLucyHome = () => {
    return Effect.gen(function* () {
        const config = yield* Config;
        const fs = yield* FileSystem.FileSystem;
        if (!(yield* fs.exists(config.config.lucyHome))) {
            logger.action(`Creating Lucy home directory at ${orange(config.config.lucyHome)}`);
            yield* fs.makeDirectory(config.config.lucyHome, { recursive: true });
        }
        const templateFiles = yield* fs.readDirectory(config.config.filesFolder);
        yield* Effect.forEach(templateFiles, (file) => fs.copy(path.join(config.config.filesFolder, file), path.join(config.config.lucyHome, file), { overwrite: true }));
    });
};

import { Effect, Schema } from "effect/index"
import { Config } from "../config.js";
import { Command, FileSystem, Path } from "@effect/platform"
import { JsonSchema } from "../schemas/index.js";
import { logger } from "../utils/logger.js";
import { isDirectoryClean } from "../utils/index.js";
import { mergeAdditions, mergeLucySettings2PackageJson } from "../commands/edit.js";
import { writeLucySettings, writePackageJson } from "../commands/write.js";
import { copyFileSync } from "../commands/copy.js";
import { readPackageJson } from "../commands/read.js";
import { execCommand } from "../commands/exec.js";
import { installPackages } from "../commands/install.js";

export const init_expo = () => {
    return Effect.gen(function*() {
        const config = yield* Config;
        const fs = yield* FileSystem.FileSystem;
        const path = yield* Path.Path;

        logger.action("Initializing Expo project...");

        const appJsonRaw = yield* fs.readFile("app.json").pipe(Effect.catchAll((error) => {
            return Effect.succeed('{}');
        }))
        const appJSON = Schema.decodeUnknownSync(JsonSchema)(appJsonRaw.toString()) as any;
        const expoAppReady = appJSON.expo ? true : false;

        const clean = yield* isDirectoryClean()
        if(!clean && !config.config.force) {
            return logger.alert("The current directory is not empty. Please run this command in an empty directory.")
        }
        if(config.config.lucySettings.initialized && !config.config.force) {
            return logger.alert("Lucy is already initialized in this directory. Use --force to reinitialize.")
        }
        if ((!clean && config.config.force) || (config.config.lucySettings.initialized && config.config.force)) logger.alert("Forced initialization!")

        if(!expoAppReady) {
            const initExpo = Command.make("npx", "create-expo-app@latest", config.config.projectName, "--template", "blank-typescript", "--no-install").pipe(
                Command.stdout("inherit"),
                Command.exitCode
            )
            if((yield* initExpo) !== 0) {
                yield* Effect.fail("Failed to initialize Expo project. Please check the error message above.");
            }

            const tempPath = path.join(config.config.cwd, config.config.projectName)

            const projectFiles = yield* fs.readDirectory(tempPath)
            yield* Effect.forEach(
                projectFiles.filter(file => file !== '.git'),
                (file) => fs.copy(path.join(tempPath, file), path.join(config.config.cwd, file), { overwrite: true }),
                { discard: true }
            )
            yield* fs.remove(tempPath, { recursive: true })
        }

        yield* readPackageJson;
        yield* mergeLucySettings2PackageJson;
        yield* mergeAdditions;
        yield* writeLucySettings;
        yield* writePackageJson;
        yield* copyFileSync;
        yield* execCommand;
        yield* installPackages;
        yield* fs.remove(path.join(config.config.cwd, "package-lock.json"), { force: true })
    })
}

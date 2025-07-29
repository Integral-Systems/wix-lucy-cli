import { Effect } from "effect/index";
import { Command, FileSystem, Path } from "@effect/platform"
import { Config } from "../config.js";

export const isDirectoryClean =(excludes: string[] = []) => {
    return Effect.gen(function*() {
        const fs = yield* FileSystem.FileSystem;
        const config = yield* Config;

        const files = yield* fs.readDirectory(config.config.cwd);
        const allExcludes = [...excludes, '.git', 'lucy.json'];
        const filteredFiles = files.filter(file => !allExcludes.includes(file));
        return filteredFiles.length > 0 ? false : true;
    });
}
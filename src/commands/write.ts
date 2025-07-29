import { Effect } from "effect/index";
import { Command, FileSystem, Path } from "@effect/platform"
import { Config } from "../config.js";

export const writeLucySettings = Effect.gen(function* (_) {
    const fs = yield* FileSystem.FileSystem;
    const path = yield* Path.Path;
    const config = yield* Config;
    
    yield* fs.writeFileString(
        path.join(config.config.cwd, "lucy.json"),
        JSON.stringify(config.config.lucySettings, null, 2)
    );
})

export const writePackageJson = Effect.gen(function* (_) {
    const fs = yield* FileSystem.FileSystem;
    const path = yield* Path.Path;
    const config = yield* Config;
    
    yield* fs.writeFileString(
        path.join(config.config.cwd, "package.json"),
        JSON.stringify(config.config.packageJson, null, 2)
    );
})
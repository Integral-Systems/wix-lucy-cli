import { Effect } from "effect/index";
import { Config } from "../config.js";
import { FileSystem, Path } from "@effect/platform"

export const cleanup = Effect.gen(function* () {
    const config = yield* Config;
    const fs = yield* FileSystem.FileSystem;
    const path = yield* Path.Path;

    yield* fs.remove(path.join(config.config.cwd, "package-lock.json"), { force: true })
});
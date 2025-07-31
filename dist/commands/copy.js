import { Effect } from "effect/index";
import { Path } from "@effect/platform";
import { FileSystem } from "@effect/platform";
import { Config } from "../config.js";
export const copyTemplateFiles = Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem;
    const config = yield* Config;
    const path = yield* Path.Path;
    const templateFiles = yield* fs.readDirectory(config.config.templateFiles);
    yield* Effect.forEach(templateFiles, (file) => fs.copy(path.join(config.config.templateFiles, file), path.join(config.config.cwd, file), { overwrite: true }));
});
//# sourceMappingURL=copy.js.map
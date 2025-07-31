import { Effect } from "effect/index";
import { Config } from "../config.js";
import { Command } from "@effect/platform/index";
import { logger } from "../utils/logger.js";
import { FileSystem } from "@effect/platform";
export const execCommand = Effect.gen(function* () {
    const config = yield* Config;
    const cmds = config.config.lucySettings.additionalCommands ?? [];
    logger.info("Executing additional commands...", cmds);
    if (cmds.length > 0) {
        logger.info("Executing additional commands");
        yield* Effect.all([
            ...cmds.map((cmd) => {
                return Command.make(cmd[0], ...cmd.slice(1))
                    .pipe()
                    .pipe(Command.stdout("inherit"), Command.exitCode);
            }),
        ]);
    }
});
export const open = Effect.scoped(Effect.gen(function* () {
    const config = yield* Config;
    const fs = yield* FileSystem.FileSystem;
    console.log("Opening Lucy home directory:", config.config.lucyHome);
    let command;
    switch (process.platform) {
        case 'darwin':
            command = Command.make('open', config.config.lucyHome);
            break;
        case 'win32':
            command = Command.make('start', config.config.lucyHome);
            break;
        default:
            command = Command.make('xdg-open', config.config.lucyHome);
            break;
    }
    command.pipe().pipe(Command.stdout("inherit"), Command.exitCode);
    yield* command.pipe().pipe(Command.stdout("inherit"), Command.exitCode);
}));
//# sourceMappingURL=exec.js.map
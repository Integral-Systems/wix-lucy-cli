import { Effect } from "effect/index";
import { Config } from "../config.js";
import { Command } from "@effect/platform/index";
import { logger } from "../utils/logger.js";
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
//# sourceMappingURL=exec%20copy.js.map
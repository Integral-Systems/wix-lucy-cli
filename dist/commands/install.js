import { Command } from "@effect/platform/index";
import { Effect, Schedule } from "effect/index";
import { Config } from "../config.js";
import { logger } from "../utils/logger.js";
export const installPackages = Effect.gen(function* () {
    const config = yield* Config;
    const pkgs = [];
    for (const [key, value] of Object.entries(config.config.lucySettings.dependencies)) {
        if (value.length > 0) {
            pkgs.push(`${key}@${value}`);
            continue;
        }
        pkgs.push(key);
    }
    const devPkgs = [];
    for (const [key, value] of Object.entries(config.config.lucySettings.devDependencies)) {
        if (value.length > 0) {
            devPkgs.push(`${key}@${value}`);
            continue;
        }
        devPkgs.push(key);
    }
    logger.info("Installing dependencies");
    const yarn = Command.make("yarn", "add", ...pkgs).pipe(Command.stdout("inherit"), // Stream stdout to process.stdout
    Command.exitCode // Get the exit code
    );
    logger.info("Installing dev dependencies");
    const yarnDev = Command.make("yarn", "add", "-D", ...devPkgs).pipe(Command.stdout("inherit"), // Stream stdout to process.stdout
    Command.exitCode // Get the exit code
    );
    if ((yield* yarn) !== 0) {
        return logger.error("Failed to install dependencies. Please check the error message above.");
    }
    if ((yield* yarnDev) !== 0) {
        return logger.error("Failed to install dev dependencies. Please check the error message above.");
    }
});
export const runYarn = Effect.gen(function* () {
    const yarnDev = Command.make("yarn").pipe(Command.stdout("inherit"), // Stream stdout to process.stdout
    Command.exitCode // Get the exit code
    );
    yield* yarnDev;
});
export const yarnSetVersion = Effect.gen(function* () {
    const yarnDev = Command.make("yarn", "set", "version", "berry").pipe(Command.stdout("inherit"), // Stream stdout to process.stdout
    Command.exitCode // Get the exit code
    );
    yield* yarnDev;
});
export const installVeloPackages = Effect.gen(function* () {
    const config = yield* Config;
    const simpleSchedule = Schedule.tapOutput(Schedule.fromDelays(50, 100, 200, 400, 800, 1600, 3200), (n) => Effect.succeed(logger.warning(`Failed to install WIX package. Retrying...`)));
    const pkgs = [];
    for (const [key, value] of Object.entries(config.config.lucySettings.dependencies)) {
        if (value.length > 0) {
            pkgs.push(`${key}@${value}`);
            continue;
        }
        pkgs.push(key);
    }
    const wixPkgs = [];
    const wixInstall = (cmd) => Effect.gen(function* () {
        const code = yield* Effect.retryOrElse(Effect.gen(function* () {
            const code = yield* cmd;
            if (code !== 0) {
                return yield* Effect.fail(code);
            }
            return yield* Effect.succeed(code);
        }), simpleSchedule, () => Effect.succeed(0));
        if (code !== 0) {
            logger.error("Failed to install WIX package.");
        }
        return code;
    });
    for (const [key, value] of Object.entries(config.config.lucySettings.dependencies)) {
        if (value.length > 0) {
            wixPkgs.push(wixInstall(Command.make("wix", "install", `${key}@${value}`).pipe(Command.stdout("inherit"), Command.exitCode)));
            continue;
        }
        wixPkgs.push(wixInstall(Command.make("wix", "install", `${key}`).pipe(Command.stdout("inherit"), Command.exitCode)));
    }
    const devPkgs = [];
    for (const [key, value] of Object.entries(config.config.lucySettings.devDependencies)) {
        if (value.length > 0) {
            devPkgs.push(`${key}@${value}`);
            continue;
        }
        devPkgs.push(key);
    }
    const yarn = Command.make("yarn", "add", ...pkgs).pipe(Command.stdout("inherit"), // Stream stdout to process.stdout
    Command.exitCode // Get the exit code
    );
    const yarnDev = Command.make("yarn", "add", "-D", ...devPkgs).pipe(Command.stdout("inherit"), // Stream stdout to process.stdout
    Command.exitCode // Get the exit code
    );
    logger.info("Installing dependencies with wix...");
    const status = yield* Effect.all([...wixPkgs], { concurrency: 15 });
    if (status.every((s) => s !== 0)) {
        return logger.error("Failed to install WIX dependencies. Please check the error message above.");
    }
    logger.info("Installing dependencies");
    if ((yield* yarn) !== 0) {
        return logger.error("Failed to install dependencies. Please check the error message above.");
    }
    logger.info("Installing dev dependencies");
    if ((yield* yarnDev) !== 0) {
        return logger.error("Failed to install dev dependencies. Please check the error message above.");
    }
});
//# sourceMappingURL=install.js.map
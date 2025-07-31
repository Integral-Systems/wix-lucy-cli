import { Effect, Schema } from "effect/index";
import { Config } from "../config.js";
import { init_expo } from "./expo.js";
import { selectTemplate } from "./templates.js";
import Enquirer from "enquirer";
import { AppError } from "../error.js";
import { createLucyHome } from "../commands/home.js";
import { readLucyJsonFromTemplate } from "../commands/read.js";
import { init_monorepo } from "./monorepo.js";
import { init_cargo } from "./cargo.js";
import { init_blocks } from "./blocks.js";
import { init_velo } from "./velo.js";
import { init_submodules } from "./gitModules.js";
import { init_tauri } from "./tauri.js";
export const init = () => {
    return Effect.gen(function* (_) {
        const config = yield* Config;
        if (config.config.action.type === undefined) {
            return yield* Effect.fail(new AppError({ message: "No action type provided", cause: new Error("No action type provided") }));
        }
        yield* createLucyHome();
        const projectName = config.config.cwd.split('/').pop() || 'expo-project';
        const templateQuestion = new Enquirer();
        const choice = yield* Effect.tryPromise({
            try: () => templateQuestion.prompt({
                type: 'input',
                name: 'projectName',
                message: 'Enter a project name',
                initial: projectName,
                validate: (value) => value.trim() !== '' ? true : 'Project name cannot be empty'
            }),
            catch: (e) => {
                return new AppError({ cause: e, message: 'Error selecting template' });
            }
        });
        const selectedName = yield* Schema.decodeUnknown(Schema.Struct({ projectName: Schema.String }))(choice);
        config.config.projectName = selectedName.projectName.trim();
        yield* selectTemplate();
        yield* readLucyJsonFromTemplate;
        if (config.config.action.type === 'expo') {
            return yield* init_expo();
        }
        if (config.config.action.type === 'monorepo') {
            return yield* init_monorepo();
        }
        if (config.config.action.type === 'cargo') {
            return yield* init_cargo();
        }
        if (config.config.action.type === 'blocks') {
            return yield* init_blocks();
        }
        if (config.config.action.type === 'tauri') {
            return yield* init_tauri();
        }
        if (config.config.action.type === 'velo') {
            return yield* init_velo();
        }
        if (config.config.action.type === 'submodules') {
            return yield* init_submodules();
        }
        yield* Effect.fail(new AppError({ message: `Unsupported action type: ${config.config.action.type}`, cause: new Error(`Unsupported action type: ${config.config.action.type}`) }));
    });
};
//# sourceMappingURL=index.js.map
import { Effect } from "effect/index";
export declare const init_cargo: () => Effect.Effect<void, import("../error.js").AppError | import("effect/ParseResult").ParseError | import("@effect/platform/Error").PlatformError, import("@effect/platform/FileSystem").FileSystem | import("../config.js").Config | import("@effect/platform/Path").Path>;

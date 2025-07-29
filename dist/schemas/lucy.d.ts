import { Schema } from "effect/index";
export declare const lucySettings: Schema.Struct<{
    modules: Schema.Record$<typeof Schema.String, Schema.Struct<{
        source: typeof Schema.String;
        branch: typeof Schema.String;
        path: Schema.optional<typeof Schema.String>;
        noCompile: Schema.optional<typeof Schema.Boolean>;
    }>>;
    veloSettings: Schema.optional<Schema.NullOr<Schema.Struct<{
        compilerOptions: Schema.NullOr<Schema.Struct<{
            composite: typeof Schema.Boolean;
            noEmit: typeof Schema.Boolean;
            lib: Schema.Array$<typeof Schema.String>;
            jsx: typeof Schema.String;
        }>>;
        exclude: Schema.NullOr<Schema.Array$<typeof Schema.String>>;
    }>>>;
    initialized: typeof Schema.Boolean;
    type: Schema.Literal<["velo", "expo", "tauri", "monorepo", "blocks", "cargo"]>;
    dependencies: Schema.Record$<typeof Schema.String, typeof Schema.String>;
    devDependencies: Schema.Record$<typeof Schema.String, typeof Schema.String>;
    scripts: Schema.Record$<typeof Schema.String, typeof Schema.String>;
    additionalCommands: Schema.optional<Schema.Array$<Schema.Array$<typeof Schema.String>>>;
    additionalPkgProps: Schema.optional<typeof Schema.Object>;
}>;
export type LucySettings = typeof lucySettings.Type;

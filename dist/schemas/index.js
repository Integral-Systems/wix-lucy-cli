import { Schema } from "effect/index";
export const JsonSchema = Schema.parseJson();
export const veloSyncSettings = Schema.Struct({
    siteUrl: Schema.String,
    secret: Schema.String,
});
export const wixSDKSettings = Schema.Struct({
    apiKey: Schema.String,
    siteId: Schema.String,
});
//# sourceMappingURL=index.js.map
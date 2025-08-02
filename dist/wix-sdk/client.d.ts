import { items, collections } from '@wix/data';
import { sites } from "@wix/sites";
import { Effect } from 'effect/index';
import { Config } from '../config.js';
import { AppError } from '../error.js';
export declare const createSDKClient: Effect.Effect<import("@wix/sdk").WixClient<undefined, import("@wix/sdk").IApiKeyStrategy, {
    items: typeof items;
    collections: typeof collections;
    sites: typeof sites;
}>, AppError, Config>;

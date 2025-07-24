import { items } from '@wix/data';
import { createClient, OAuthStrategy } from '@wix/sdk';
import { Data } from 'effect';

const clientId = process.env.EXPO_PUBLIC_WIX_CLIENT_ID || "";

//To access the Wix APIs, create a client with the createClient() function imported from the @wix/sdk package.
export const client = createClient({
    modules: { items },
    auth: OAuthStrategy({ clientId: clientId }),
});
export class ClientError extends Data.TaggedError('ErrorParserError') {}



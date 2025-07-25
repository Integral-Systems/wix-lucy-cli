import { Effect, Schedule, Schema } from 'effect';

import { client, ClientError } from './wix';

const dataSchema = Schema.Struct({
	source: Schema.String,
	content: Schema.String,
	_id: Schema.String,
	_owner: Schema.String,
	_createdDate: Schema.Any,
	_updatedDate: Schema.Any,
});

const COLLECTION_NAME = 'dailySpiritQuotes';

export const getQuote = () => Effect.gen(function* () {
	const count = yield* Effect.retry(Effect.tryPromise({
		try: () => client.items.query(COLLECTION_NAME).count(),
		catch: (error) => {
			console.error('Error fetching quotes:', error);
			Effect.fail(new ClientError());
		}
	}), Schedule.fromDelays(50, 100, 200, 400, 800));

	if (count === 0) {
		return yield* Effect.fail(new Error('No quotes found in the collection.'));
	}
    
	const randomIndex = Math.floor(Math.random() * count);

	const data = yield* Effect.retry(Effect.tryPromise({
		try: () => client.items.query(COLLECTION_NAME).skip(randomIndex).limit(1).find(),
		catch: (error) => {
			console.error('Error fetching quotes:', error);
			Effect.fail(new ClientError());
		}
	}), Schedule.fromDelays(50, 100, 200, 400, 800));

	yield* Effect.logDebug(`Fetched ${JSON.stringify(data, null, 2)}`);

	const quote = yield* Schema.decodeUnknown(dataSchema)(data.items[0]);
	
	return { source: quote.source, content: quote.content };
}).pipe(Effect.catchAll((error) => {
	console.error('Failed to fetch quote:', error);
	
	return Effect.succeed({ source: 'The Lord', content: 'The ways of the Lord are inscrutable.' });
}));
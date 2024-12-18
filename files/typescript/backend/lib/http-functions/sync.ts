/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import crypto from 'crypto';
import wixData from 'wix-data';
import { forbidden, ok, serverError, WixHttpFunctionRequest, WixHttpFunctionResponse } from 'wix-http-functions';
import { mediaManager } from 'wix-media-backend';
import wixSecretsBackend from 'wix-secrets-backend';

/**----------------------------------------------
 * *                   INFO
 *   URL to call this HTTP function from your published site looks like:
 *   Premium site - https://mysite.com/_functions/example/multiply?leftOperand=3&rightOperand=4
 *   Free site - https://username.wixsite.com/mysite/_functions/example/multiply?leftOperand=3&rightOperand=4
 * 
 *   URL to test this HTTP function from your saved site looks like:
 *   Premium site - https://mysite.com/_functions-dev/example/multiply?leftOperand=3&rightOperand=4
 *   Free site - https://username.wixsite.com/mysite/_functions-dev/example/multiply?leftOperand=3&rightOperand=4
 *---------------------------------------------**/

//! WARNING: The following code is taken out of velo-sync package.
//! WARNING: This serves as example and is not tested.

class ForbiddenError extends Error {
	constructor(message: string) {
		super(message);
		this.type = FORBIDDEN;
	}
	type: string;
}

const FORBIDDEN = 'forbidden';

/**
 * Validates the request and parses the payload
 * @param request - the request object
 * @returns the parsed payload
 */
export async function validateAndParseRequest(request: WixHttpFunctionRequest) {
	const payload = await request.body.text();
	const payloadJson = JSON.parse(payload, dateReviver) as any;
	const secret = await wixSecretsBackend.getSecret('velo-sync');
	const hmac = crypto.createHmac('sha256', secret);
	hmac.update(JSON.stringify(payloadJson.data, dateReplacer));
	const digest = hmac.digest('hex');
	if (digest !== payloadJson.signature){
		const forbiddenError = new ForbiddenError('invalid signature check');
		forbiddenError.type = FORBIDDEN;
		throw forbiddenError;
	}
	
	return payloadJson.data;
}

/**
 * Logs the request and handles the response
 * @param name - the name of the request
 * @param handler - the handler function
 * @returns the response object
 */
export async function logRequest(name:string, handler: () => Promise<any>) {
	console.log(name, 'start');
	const start = new Date().getTime();
	try {
		const response = await handler();
		const now = new Date().getTime();
		console.log(name, 'completed ok, time:', now - start);
		
		return ok({ body: response });
	}
	catch (e: any){
		const now = new Date().getTime();
		if (e.type === FORBIDDEN){
			console.log(name, 'forbidden:', e.message, ', time:', now - start);
			
			return forbidden({ body: e.message });
		}
		else {
			console.log(name, 'failed with error:', e.message, ', time:', now - start);
			
			return serverError({ body: e.message });
		}
	}
}

/**
 * Checks if the service is alive
 * @param request - the request object
 * @returns the response object
 */
export async function isAlive(request: WixHttpFunctionRequest): Promise<WixHttpFunctionResponse> {
	return await logRequest('isAlive', async () => {
		const data = await validateAndParseRequest(request);
		if (data.isAlive === '?')
		{return 'ok';}
		else
		{throw new Error('protocol error - the isAlive API expects isAlive member in the data payload');}
	});
}

/**
 * Inserts a batch of items
 * @param request - the request object
 * @returns the response object
 */
export async function insertItemBatch(request: WixHttpFunctionRequest): Promise<WixHttpFunctionResponse> {
	return await logRequest('insertItemBatch', async () => {
		const data = await validateAndParseRequest(request);
		const itemsToInsert = data.items;
		const collection = data.collection;
		
		return await wixData.bulkInsert(collection, itemsToInsert, { suppressAuth: true });
	});
}

/**
 * Saves a batch of items
 * @param request - the request object
 * @returns the response object
 */
export async function saveItemBatch(request: WixHttpFunctionRequest): Promise<WixHttpFunctionResponse> {
	return await logRequest('saveItemBatch', async () => {
		const data = await validateAndParseRequest(request);
		const items = data.items;
		const collection = data.collection;
		
		return await wixData.bulkSave(collection, items, { suppressAuth: true });
	});
}

/**
 * Clears stale items
 * @param request - the request object
 * @returns the response object
 */
export async function clearStale(request: WixHttpFunctionRequest): Promise<WixHttpFunctionResponse> {
	return await logRequest('clearStale', async () => {
		const data = await validateAndParseRequest(request);
		const collection = data.collection;

		const date = new Date();
		date.setDate(date.getDate() - 3);

		const res = await wixData.query(collection)
			.lt('_updatedDate', date)
			.find({ suppressAuth: true });
		console.log(`clearStale - found ${res.totalCount} items to remove, current page ${res.length}`);
		const itemsToDelete = res.items;
		const ids = itemsToDelete.map((_: any )=> _._id);
		const removeResult = await wixData.bulkRemove(collection, ids, { suppressAuth: true });

		return { itemsRemoved: removeResult.removed, staleItems: res.totalCount - removeResult.removed, errors: removeResult.errors };
	});
}

/**
 * Batch checks the update state of items
 * @param request - the request object
 * @returns the response object
 */
export async function batchCheckUpdateState(request: WixHttpFunctionRequest): Promise<WixHttpFunctionResponse> {
	return await logRequest('batchCheckUpdateState', async () => {
		const data = await validateAndParseRequest(request);

		const collection = data.collection;
		const items = data.items;
		const dryrun = data.dryrun;

		const queries = items.map((item: any) => wixData.query(collection).eq('_id', item._id));

		const query = queries.reduce((accuQuery: any, query: any) => (accuQuery)?accuQuery.or(query): query);
		const result:any[] = [];
		const itemsToUpdate: any[] = [];
		const res = await query.find({ suppressAuth: true });
		items.forEach((item: any) => {
			const foundItem = res.items.find((_: any) => _._id === item._id);
			if (foundItem && foundItem._hash === item._hash){
				itemsToUpdate.push(foundItem);
				result.push({ status: 'ok', _id: item._id });
			}
			else if (foundItem){
				result.push({ status: 'need-update', _id: item._id });
			}
			else {
				result.push({ status: 'not-found', _id: item._id });
			}
		});
		if (!dryrun)
		{await wixData.bulkUpdate(collection, itemsToUpdate, { suppressAuth: true });}
		
		return JSON.stringify(result);
	});
}

/**
 * Gets an image upload URL
 * @param request - the request object
 * @returns the response object
 */
export async function getImageUploadUrl(request: WixHttpFunctionRequest): Promise<WixHttpFunctionResponse> {
	return await logRequest('getImageUploadUrl', async () => {
		const data = await validateAndParseRequest(request);

		const mimeType = data.mimeTypes;
		const _id = data._id;
		const fieldName = data.fieldName;
		const collection = data.collection;
		const mediaType = data.mediaType;

		const uploadUrlObj = await mediaManager.getUploadUrl('/synced-images',
			{
				'mediaOptions': {
					mimeType,
					mediaType
				},
				'metadataOptions': {
					'isPrivate': false,
					'isVisitorUpload': false,
					'context': {
						_id,
						fieldName,
						collection
					}
				}
			});
		
		return uploadUrlObj;
	});
}

const dateRegex = /^Date\((\d+)\)$/;
/**
 *
 * @param key
 * @param value
 */
 
/**
 * Reviver function for JSON.parse that converts string representations of Date objects to Date objects
 * @param key The key of the value
 * @param value The value to convert
 * @returns The converted Date object
 */
export function dateReviver(key: string, value: string) {
	const match = dateRegex.exec(value);
	if (match){
		return new Date(Number(match[1]));
	}
	
	return value;
}

/**
 * Replacer function for JSON.stringify that converts Date objects to a string representation
 * @param key The key of the value
 * @param value The value to convert
 * @returns The converted value
 */
export function dateReplacer(this: any, key: string, value: string) {
	const v = this[key];
	if (v instanceof Date)
	{return 'Date('+v.getTime()+')';}
	else
	{return value;}
}
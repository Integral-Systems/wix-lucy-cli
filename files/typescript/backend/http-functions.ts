/* eslint-disable @typescript-eslint/naming-convention */
import { batchCheckUpdateState, clearStale, getImageUploadUrl, insertItemBatch, isAlive, saveItemBatch } from 'backend/lib/http-functions/sync2';
import { WixHttpFunctionRequest } from 'wix-http-functions';

/**------------------------------------------------------------------------
 **                            Health-Check endpoint
 * This function are for Health-Check 
 * https://sunnyside-up.wixstudio.com/yeva/_functions/healthCheck
 *------------------------------------------------------------------------**/
/**
 * Handle the HealthCheck request
 * @param request The request object
 * @returns The response object
 */

export function get_healthCheck(request: WixHttpFunctionRequest) {
    return ok({ body: "I am alive 🦄!" });
}
/*--------------- END OF SECTION --------------*/

/**------------------------------------------------------------------------
 **                            Velo-Sync endpoints
 * This function are for the velo-sync functionality
 * https://www.npmjs.com/package/velo-sync
 *------------------------------------------------------------------------**/
/**
 * Handle the isAlive request
 * @param request The request object
 * @returns The response object
 */
export async function post_isAlive(request: WixHttpFunctionRequest) {
	return await isAlive(request);
}

/**
 * Handle the insertItemBatch request
 * @param request The request object
 * @returns The response object
 */
export async function post_insertItemBatch(request: WixHttpFunctionRequest) {

	return await insertItemBatch(request);
}

/**
 * Handle the saveItemBatch request
 * @param request The request object
 * @returns The response object
 */
export async function post_saveItemBatch(request: WixHttpFunctionRequest) {
	return await saveItemBatch(request);
}

/**
 * Handle the clearStale request
 * @param request The request object
 * @returns The response object
 */
export async function post_clearStale(request: WixHttpFunctionRequest) {
	return await clearStale(request);
}

/**
 * Handle the batchCheckUpdateState request
 * @param request The request object
 * @returns The response object
 */
export async function post_batchCheckUpdateState(request: WixHttpFunctionRequest) {
	return await batchCheckUpdateState(request);
}

/**
 * Handle the getImageUploadUrl request
 * @param request The request object
 * @returns The response object
 */
export async function post_getImageUploadUrl(request: WixHttpFunctionRequest) {
	return await getImageUploadUrl(request);
}
/*--------------- END OF SECTION --------------*/


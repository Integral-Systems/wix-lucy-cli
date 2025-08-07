import { Effect } from 'effect/index';
import { logger } from '../utils/logger.js';
import { checkForVelo } from '../commands/checks.js';
import { gitInit } from '../commands/git.js';
import { installVeloPackages, runInstall } from '../commands/install.js';
import { setInitialized } from '../commands/edit.js';

export const prepareVelo = Effect.gen(function*() {
	logger.action("Initializing Tauri project...");
	yield* checkForVelo();

	yield* gitInit(true);
	yield* installVeloPackages
	yield* runInstall
	yield* setInitialized;
	
    logger.success("Velo Prepared initialized successfully!");

})
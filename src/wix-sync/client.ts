import syncTask from 'velo-sync/dist/tasks/sync-task.js';
import { MigrateFileCache, SyncTaskType } from "../schemas/types";
import migrateFileCache from 'velo-sync/dist/tasks/migrate-files-cache-task.js';

export const runSyncTask = (syncTask as unknown as { default: SyncTaskType }).default;
export const migrateFileCacheTask = (migrateFileCache as unknown as { default: MigrateFileCache }).default;

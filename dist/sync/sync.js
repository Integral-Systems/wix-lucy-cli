"use strict";
// import chalk, { modifierNames } from "chalk";
// import readline from 'node:readline';
// import {createDataSync, LoggingStatistics, LoggerRejectsReporter} from 'velo-sync';
// import veloAPI from 'velo-sync/dist/velo/velo-api.js';
// import syncTask from 'velo-sync/dist/tasks/sync-task.js';
// import { readConfig, saveConfig, VeloSyncConfig } from "./helpers.js";
// import optimist from 'optimist';
// import migrateFileCache from 'velo-sync/dist/tasks/migrate-files-cache-task.js';
// function printUsage() {
//     console.log('Usage:  ');
//     console.log('');
//     console.log('Commands:');
//     console.log('  init          generates a config file for the import / export / sync process');
//     console.log('  is-alive      tests the config and the connection to the site');
//     console.log('  sync          runs the sync process');
//     console.log('  import        runs an import process');
//     console.log('  migrate       migrate existing nedb cache to sqlite cache (.upload-cache.db => .upload-cache.sqlite.db)');
// }
// function syncOrImportTask(importOnly: boolean) {
//     let argv = optimist
//         .usage(`Usage: $0 ${importOnly ? 'import' : 'sync'} -f <scv filename> -c <collection>`)
//         .demand('f')
//         .alias('f', 'filename')
//         .describe('f', 'csv filename to import')
//         .demand('c')
//         .describe('c', 'the name of the collection to import into')
//         .alias('c', 'collection')
//         .demand('s')
//         .describe('s', 'schema file describing the fields of the collection')
//         .alias('s', 'schema')
//         .describe('dry', 'dry-run that does not upload any data or files, and does not remove or update anything on the site')
//         .alias('dry', 'dryrun')
//         .parse(process.argv.slice(3));
//     let filename = argv.filename;
//     let collection = argv.collection;
//     let schema = argv.schema;
//     let dryrun = argv.dryrun;
//     //@ts-ignore
//     syncTask.default(filename, collection, schema, importOnly, dryrun);
// }
// export async function sync() {
//     if(moduleSettings.args.includes('-h') || moduleSettings.args.includes('help')) return printUsage();
//     if(moduleSettings.args.includes('init')) {
//         const rl = readline.createInterface({
//             input: process.stdin,
//             output: process.stdout,
//             terminal: true
//         });
//         async function askQuestion(query: string):Promise<string> {
//             return new Promise((resolve) => rl.question(query, (answer) => resolve(answer)));
//         }
//         console.log(chalk.yellow('hello to velo-sync init'));
//         let siteUrl = await askQuestion(orange('what is the url of the site homepage? '));
//         let secret = await askQuestion(orange('what is the velo-sync secret? '));
//         rl.close();
//         let config: VeloSyncConfig = { siteUrl, secret };
//         await saveConfig(config, moduleSettings.veloConfigName);
//         return console.log(chalk.green("🐕" + ' => config saved!'));
// 	}
//     if(moduleSettings.args.includes('is-alive')) {
//         try {
//             let config = await readConfig(moduleSettings.veloConfigName);
//             console.log("🐕" + green(` => checking if the API for site ${chalk.greenBright(config.siteUrl)} is alive...`));
//             await veloAPI.isAlive(config);
//             return console.log(chalk.green("🐕" + ` => API of site ${chalk.greenBright(config.siteUrl)} is working and alive!!!`));
//         }
//         catch (e) {
//             if(e instanceof Error)  {
//                 return console.log((`💩 ${red.underline.bold("=> Failed to check endpoint")} ${orange(e.message)}`));
//             }
//         }
//     }
//     if(moduleSettings.args.includes('sync')) {
//         return syncOrImportTask(false);
//     }
//     if(moduleSettings.args.includes('import')) {
//         return syncOrImportTask(true);
//     }
//     if(moduleSettings.args.includes('export')) {
//         return console.log((`💩 ${red.underline.bold("=> Not implemented")}`));
//     }
//     if(moduleSettings.args.includes('migrate')) {
//         //@ts-ignore
//         migrateFileCache.default();
//     }
// }
//# sourceMappingURL=sync.js.map
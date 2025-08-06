import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { initTypes, LucyArgs, taskNames, syncActions } from "./schemas/types.js";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const pkg = require("../package.json");

export async function get_args(): Promise<LucyArgs> {
    const argv = await yargs(hideBin(process.argv))
        .usage('Usage: $0 <command> [options]')
        .command('init <initType>', 'Initialize a new Lucy project', (yargs) => {
            return yargs.positional('initType', {
                describe: 'The type of project to initialize',
                choices: initTypes,
                demandOption: true,
            })
        }).option('force', {
            alias: 'f',
            type: 'boolean',
            description: 'Run with force'
        })
        .command('open', 'Open the Lucy home directory')
        .command('task <tasksName>', 'Run a task', (yargs) => {
            return yargs.positional('tasksName', {
                describe: 'The task to run',
                choices: taskNames,
                demandOption: true,
            })
        })
        .command('wix-sync <syncAction>', 'Run a velo-sync action', (yargs) => {
            return yargs.positional("syncAction", {
                describe: "The velo-sync action to run",
                choices: syncActions,
                demandOption: true,
            })
            .option('input', {
                alias: 'i',
                type: 'string',
                describe: 'The CSV file to import',
                demandOption: false,
            })
            .option('c', {
                alias: 'collection',
                type: 'string',
                describe: 'The name of the collection to import data into',
                demandOption: false,
            })
            .option('s', {
                alias: 'schema',
                type: 'string',
                describe: 'The schema file',
                demandOption: false,
            })
            .option('d', {
                type: 'boolean',
                describe: 'Run in dry-run mode',
                demandOption: false,
            });
        })
        .command('wix-sdk <wixSDKAction>', 'Run a velo-sync action', (yargs) => {
            return yargs.positional("wixSDKAction", {
                describe: "The velo-sync action to run",
                choices: syncActions,
                demandOption: true,
            });
        })
        .demandCommand(1, 'You need to provide a command. Use --help for a list of commands.')
        .version('v', 'Show version number', pkg.version)
        .alias('v', 'version')
        .help()
        .alias('h', 'help')
        .strict()
        .wrap(yargs().terminalWidth())
        .epilogue('For more information, visit https://github.com/your-repo/wix-lucy-cli')
        .parseAsync();

    // The cast is now safer with the defined interface.
    return argv as LucyArgs;
}
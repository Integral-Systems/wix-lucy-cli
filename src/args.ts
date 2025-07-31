import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { LucyArgs, tasks, types } from "./schemas/types.js";

export async function get_args(): Promise<LucyArgs> {
    const argv = await yargs(hideBin(process.argv))
        .usage('Usage: $0 <command> [options]')
        .command('init <type>', 'Initialize a new Lucy project', (yargs) => {
            return yargs.positional('type', {
                describe: 'The type of project to initialize',
                choices: types,
                demandOption: true,
            })
        }).option('force', {
            alias: 'f',
            type: 'boolean',
            description: 'Run with force'
        })
        .command('open', 'Open the Lucy home directory')
        .command('task <task>', 'Run a task', (yargs) => {
            return yargs.positional('task', {
                describe: 'The task to run',
                choices: tasks,
                demandOption: true,
            })
        })
        .demandCommand(1, 'You need to provide a command. Use --help for a list of commands.')
        .help()
        .alias('h', 'help')
        .strict()
        .wrap(yargs().terminalWidth())
        .epilogue('For more information, visit https://github.com/your-repo/wix-lucy-cli')
        .parseAsync();

    // The cast is now safer with the defined interface.
    return argv as LucyArgs;
}
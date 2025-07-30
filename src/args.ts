import yargs from "yargs";
import { hideBin } from "yargs/helpers";

// It's a good practice to define an interface for your arguments
// for type safety throughout your application.
export interface LucyArgs {
    [x: string]: unknown;
    // This will hold the command used, e.g., 'init'
    _: (string | number)[];
    $0: string;
    // Arguments for the 'init' command
    type?: 'velo' | 'expo' | 'blocks' | 'monorepo' | 'tauri' | 'cargo';
}

export async function get_args(): Promise<LucyArgs> {
    const argv = await yargs(hideBin(process.argv))
        .usage('Usage: $0 <command> [options]')
        .command('init <type>', 'Initialize a new Lucy project', (yargs) => {
            return yargs.positional('type', {
                describe: 'The type of project to initialize',
                choices: ['velo', 'expo', 'blocks'] as const,
                demandOption: true, // Makes this positional argument required
            })
        }).option('force', {
            alias: 'f',
            type: 'boolean',
            description: 'Run with force'
        })
        // Enforce that a command must be provided (e.g., 'init')
        .demandCommand(1, 'You need to provide a command. Use --help for a list of commands.')
        .help()
        .alias('h', 'help')
        .strict()
        .wrap(yargs().terminalWidth()) // Wrap help text to terminal width
        .epilogue('For more information, visit https://github.com/your-repo/wix-lucy-cli') // Example of a relevant epilogue
        .parseAsync();

    // The cast is now safer with the defined interface.
    return argv as LucyArgs;
}
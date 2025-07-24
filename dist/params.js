import yargs from "yargs";
import { hideBin } from "yargs/helpers";
export async function get_args() {
    const argv = await yargs(hideBin(process.argv))
        .usage('Usage: $0 <command> [options]')
        .command('init <type>', 'Initialize a new Lucy project', (yargs) => {
        return yargs.positional('type', {
            describe: 'The type of project to initialize',
            choices: ['velo', 'expo', 'blocks'],
            demandOption: true, // Makes this positional argument required
        });
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
    return argv;
}

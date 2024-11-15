// https://www.sergevandenoever.nl/run-gulp4-tasks-programatically-from-node/
import path from 'path';
import { fileURLToPath } from 'url';
export async function dev(moduleSettings, projectSettings, task) {
    // Get the directory name of the current module
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    // Resolve the path to the Gulpfile
    const gulpfilePath = path.resolve(__dirname, 'Gulpfile.js');
    // Dynamically import the Gulpfile
    const gulpfile = await import(`file://${gulpfilePath}`);
    // Check if 'dev' task exists
    gulpfile.runTask('dev', moduleSettings, projectSettings);
}

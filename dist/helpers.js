import os from 'os';
import { exec } from 'child_process';
import { logger } from './utils/logger.js';
export function parse_error(error) {
    if (error instanceof Error) {
        return error;
    }
    else if (typeof error === 'string') {
        return new Error(error);
    }
    else {
        return new Error('Unknown error');
    }
}
/**
 * Kill all processes matching a specific substring in their command, with a fallback for Windows.
 * @param {string} processPattern - The substring to match (e.g., "wix:dev" or "@wix/cli/bin/wix.cjs").
 */
export function killAllProcesses(processPattern) {
    const isWindows = os.platform() === 'win32';
    const command = isWindows
        ? `tasklist /FI "IMAGENAME eq node.exe" /FO CSV | findstr "${processPattern}"` // Adjust for Node.js processes
        : `ps -eo pid,command | grep "${processPattern}" | grep -v grep`;
    exec(command, (error, stdout, stderr) => {
        if (error) {
            logger.error(`Failed to find processes matching pattern: ${processPattern}`);
            return;
        }
        if (stderr) {
            logger.error(`Error output:')} ${stderr}`);
        }
        if (!stdout.trim()) {
            logger.info(`No processes found matching pattern: ${processPattern}`);
            return;
        }
        logger.info(`Found matching processes:\n${stdout}`);
        const lines = stdout.trim().split('\n');
        const pids = isWindows
            ? lines.map(line => line.match(/"(\d+)"/)?.[1]) // Extract PID from Windows tasklist output
            : lines.map(line => line.trim().split(/\s+/)[0]).filter(pid => !isNaN(Number(pid)));
        pids.forEach(pid => {
            if (!pid)
                return;
            try {
                const killCommand = isWindows
                    ? `taskkill /PID ${pid} /T /F` // Forcefully terminate the process on Windows
                    : `kill -SIGTERM ${pid}`;
                exec(killCommand, (killError) => {
                    if (killError) {
                        logger.error(`Failed to kill process with PID ${pid}: ${killError.message}`);
                    }
                    else {
                        logger.success(`Killed process with PID: ${pid}`);
                    }
                });
                // Schedule SIGKILL fallback for non-Windows platforms
                if (!isWindows) {
                    setTimeout(() => {
                        try {
                            process.kill(parseInt(pid, 10), 'SIGKILL');
                            logger.kill(`Sent SIGKILL to process with PID: ${pid}`);
                        }
                        catch (killError) {
                            if (killError.code === 'ESRCH') {
                                logger.info(`Process with PID ${pid} already terminated.`);
                            }
                            else {
                                logger.error(`Failed to send SIGKILL to process with PID ${pid}: ${killError.message}`);
                            }
                        }
                    }, 10000);
                }
            }
            catch (err) {
                logger.error(`Failed to kill process with PID ${pid}: ${err.message}`);
            }
        });
    });
}
/**
 * Clean up and run a command before exiting the process.
 */
export function cleanupWatchers() {
    logger.info(`🧹 Cleaning up Watchman watchers...`);
    const cwd = process.cwd();
    const command = `watchman watch-del "${cwd}"`; // Adjust for Windows paths
    exec(command, (error, stdout, stderr) => {
        if (error) {
            logger.error(`Failed to run cleanup command: ${error.message}`);
            return;
        }
        if (stderr) {
            logger.error(`Watchman stderr: ${stderr}`);
        }
        logger.info(`Watchman cleanup success: ${stdout}`);
    });
}
//# sourceMappingURL=helpers.js.map
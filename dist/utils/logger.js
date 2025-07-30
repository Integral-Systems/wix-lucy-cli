import chalk from "chalk";
export const orange = chalk.hex('#FFA500');
export const blue = chalk.blueBright;
export const green = chalk.greenBright;
export const red = chalk.redBright;
export const yellow = chalk.yellow;
export const magenta = chalk.magentaBright;
export const logger = {
    success: (message, ...optionalParams) => {
        console.log("🐶" + green.underline(' => ' + message + optionalParams.map(param => ' ' + param)), ' ✅');
    },
    info: (message, ...optionalParams) => {
        console.log("🐶" + blue.underline(' => ' + message + optionalParams.map(param => ' ' + param)), ' ℹ️');
    },
    action: (message, ...optionalParams) => {
        console.log("🐕" + blue.underline(' => ' + message + optionalParams.map(param => ' ' + param)));
    },
    exception: (message, ...optionalParams) => {
        console.log("💥" + red.underline(' => ' + message + optionalParams.map(param => ' ' + param)));
    },
    error: (message, ...optionalParams) => {
        console.log("🛑" + red.underline(' => ' + message + optionalParams.map(param => ' ' + param)));
    },
    warning: (message, ...optionalParams) => {
        console.log("⚠️" + orange.underline(' => ' + message + optionalParams.map(param => ' ' + param)));
    },
    alert: (message, ...optionalParams) => {
        console.log("🚨" + yellow.underline(' => ' + message + optionalParams.map(param => ' ' + param)));
    },
    report: (message, ...optionalParams) => {
        console.log("📝" + magenta.underline(' => ' + message + optionalParams.map(param => ' ' + param)));
    },
    kill: (message, ...optionalParams) => {
        console.log("🔪" + red.underline(' => ' + message + optionalParams.map(param => ' ' + param)));
    }
};
//# sourceMappingURL=logger.js.map
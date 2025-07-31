import chalk from "chalk";
import { error } from "effect/Brand";
import { info } from "sass";

export const orange = chalk.hex('#FFA500');
export const blue = chalk.blueBright;
export const green = chalk.greenBright;
export const red = chalk.redBright;
export const yellow = chalk.yellow;
export const magenta = chalk.magentaBright;

export const logger = {
    success: (message: string, ...optionalParams: any[]) => {
        console.log("🐶" + green.underline(' => ' + message + optionalParams.map(param => ' ' + param)), ' ✅');
    },
    info: (message: string, ...optionalParams: any[]) => {
        console.log("🐶" + blue.underline(' => ' + message + optionalParams.map(param => ' ' + param)), ' ℹ️');
    },
    action: (message: string, ...optionalParams: any[]) => {
        console.log("🐕" + blue.underline(' => ' + message + optionalParams.map(param => ' ' + param)));
    },
    exception: (message: string, ...optionalParams: any[]) => {
        console.log("💥" + red(' => ' + message + optionalParams.map(param => ' ' + param)));
    },
    error: (message: string, ...optionalParams: any[]) => {
        console.log("🛑" + red(' => ' + message + optionalParams.map(param => ' ' + param)));
    },
    warning: (message: string, ...optionalParams: any[]) => {
        console.log("⚠️" + orange.underline(' => ' + message + optionalParams.map(param => ' ' + param)));
    },
    alert: (message: string, ...optionalParams: any[]) => {
        console.log("🚨" + yellow.underline(' => ' + message + optionalParams.map(param => ' ' + param)));
    },
    report : (message: string, ...optionalParams: any[]) => {
        console.log("📝" + magenta.underline(' => ' + message + optionalParams.map(param => ' ' + param)));
    },
    kill : (message: string, ...optionalParams: any[]) => {
        console.log("🔪" + red.underline(' => ' + message + optionalParams.map(param => ' ' + param)));
    }
};
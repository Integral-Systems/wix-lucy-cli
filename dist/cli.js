#!/usr/bin/env node
import { helloWorld } from './index.js';
const args = process.argv.slice(2);
const cwd = process.cwd();
/**
 *
 */
function main() {
    console.log({ args, cwd });
    if (args.includes('help') || args.includes('-h')) {
        console.log('Help is on the way!');
        return;
    }
    if (args.includes('version') || args.includes('-v')) {
        console.log('1.0.0');
        return;
    }
    if (args.includes('init')) {
        helloWorld();
        return;
    }
    if (args.includes('sync')) {
        console.log('Hello serve');
        return;
    }
}
main();
// const fs = require("fs"),
//     path = require("path")
// /** Parse the command line */
// var args = process.argv.slice(2);
// // Validate input
// if (args.length !== 2) {
//     console.log("Warning: Requires 2 arguments");
//     console.log("node index.js [path/source.html] [targetfile]");
//     process.exit();
// }
// const src = args[0];
// const target = args[1];
// const dirsrc = path.dirname(src);
// if (!fs.existsSync(src)) {
//     console.log("Error: Source file doesn't exist. Given: ", src);
//     process.exit();
// }

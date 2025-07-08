import * as path from 'path';
import * as fs from 'fs';
export function getModulesSync() {
    const absolutePath = path.resolve('./lucy.json');
    const fileContent = fs.readFileSync(absolutePath, 'utf8');
    return JSON.parse(fileContent).modules;
}
export function getModulesSourcePaths() {
    const absolutePath = path.resolve('./lucy.json');
    const fileContent = fs.readFileSync(absolutePath, 'utf8');
    const data = JSON.parse(fileContent).modules;
    const paths = [];
    for (const module of Object.keys(data)) {
        if (!data[module].noCompile) {
            if (data[module].path) {
                paths.push(data[module].path);
            }
            else {
                paths.push(module);
            }
        }
    }
    return paths;
}

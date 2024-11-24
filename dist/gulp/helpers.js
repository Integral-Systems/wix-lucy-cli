import * as path from 'path';
import * as fs from 'fs';
export function getModulesSync() {
    const absolutePath = path.resolve('./lucy.json');
    const fileContent = fs.readFileSync(absolutePath, 'utf8');
    return JSON.parse(fileContent).modules;
}

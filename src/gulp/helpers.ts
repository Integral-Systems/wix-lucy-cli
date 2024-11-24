
import * as path from 'path';
import * as fs from 'fs';

export function getModulesSync(): Record<string, string> | undefined {
    const absolutePath = path.resolve('./lucy.json');
    const fileContent = fs.readFileSync(absolutePath, 'utf8') as any;
    return JSON.parse(fileContent).modules;
}
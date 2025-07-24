
import * as path from 'path';
import * as fs from 'fs';

export function getModulesSync(): Record<string, string> | undefined {
    const absolutePath = path.resolve('./lucy.json');
    const fileContent = fs.readFileSync(absolutePath, 'utf8') as any;
    return JSON.parse(fileContent).modules;
}

export function getModulesSourcePaths(): string[] {
    const absolutePath = path.resolve('./lucy.json');
    const fileContent = fs.readFileSync(absolutePath, 'utf8') as any;
    const data =  JSON.parse(fileContent).modules;
    const paths: string[] = [];
    for (const module of Object.keys(data)) {
        if (!data[module].noCompile) {
            if (data[module].path) {
                paths.push(data[module].path);
            } else {
                paths.push(module);
            }
        }
    }
    return paths;
}
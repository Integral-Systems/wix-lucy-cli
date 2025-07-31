/* eslint-disable @typescript-eslint/naming-convention */
import path from 'node:path';

import fs from 'fs';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [
		tsconfigPaths({
			projects: ['./local.tsconfig.json'],
		}),
		{
			name: 'multi-folder-wix-resolution',
			enforce: 'pre',
			resolveId(source) {

				if (source.startsWith('wix')){
					const moduleName = source.replace(/^wix/, '');
					const candidates = [
						path.resolve(__dirname, './lib/__mocks__/wix' + moduleName),
						path.resolve(__dirname, './typescript/__mocks__/wix' + moduleName),
					];

					for (const candidate of candidates){
						if (fs.existsSync(candidate + '.ts') || fs.existsSync(candidate + '/index.ts')){
							return candidate;
						}
					}
				}

				return null;
			},
		},
	],
	test: {
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			reportsDirectory: './coverage',
			exclude: ['**/node_modules/**', 'src/**', '.wix/**', '**/models/**', '**/__mocks__/**', 'docs/**', 'cypress/**', '**/pages/**'],
		},
		alias: {}
	},
});
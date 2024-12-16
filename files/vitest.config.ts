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
					const baseName = source.replace(/^wix/, '');
					const candidates = [
						path.resolve(__dirname, './lib/__mocks__/wix' + baseName),
						path.resolve(__dirname, './typescript/__mocks__/wix' + baseName),
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
	// resolve: {
	// 	alias: [
	// 		{
	// 			find: /^wix(.*)$/,
	// 			replacement: path.resolve(__dirname, './lib/__mocks__/wix$1'),
	// 		},
	// 		{
	// 			find: /^wix(.*)$/,
	// 			replacement: path.resolve(__dirname, './typescript/__mocks__/wix$1'),
	// 		},
	// 	],
	// },
});
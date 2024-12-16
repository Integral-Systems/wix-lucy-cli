// eslint-disable-next-line @typescript-eslint/naming-convention
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [tsconfigPaths({
		projects: ['./typescript/tsconfig.json'],
	})],
	test: {
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			reportsDirectory: './coverage',
			exclude: ['**/node_modules/**', 'src/**', '.wix/**'],
		},
	},
});
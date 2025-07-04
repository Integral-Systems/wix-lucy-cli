import { defineConfig } from 'cypress';
import { cloudPlugin } from 'cypress-cloud/plugin';

export default defineConfig({
	videoCompression: 15,
	chromeWebSecurity: true,
	pageLoadTimeout: 120000,
	defaultCommandTimeout: 10000,
	retries: {
		runMode: 0,
		openMode: 0,
	},
	e2e: {
		baseUrl: 'https://www.heise.de/',
		setupNodeEvents(on, config) {
			return cloudPlugin(on, config);
		},
	},
});

/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// cypress.config.js
const { defineConfig } = require('cypress');
const { cloudPlugin } = require('cypress-cloud/plugin');

module.exports = defineConfig({
	videoCompression: 15,
	chromeWebSecurity: true,
	pageLoadTimeout: 120000,
	defaultCommandTimeout: 10000,
	retries: {
		runMode: 0,
		openMode: 0,
	},
	e2e: {
		baseUrl: 'https://www.somehost.com/',
		setupNodeEvents(on, config) {
			return cloudPlugin(on, config);
		},
	},
});
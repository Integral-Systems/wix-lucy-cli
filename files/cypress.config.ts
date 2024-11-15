// cypress.config.js
import { defineConfig } from "cypress";
import { cloudPlugin } from "cypress-cloud/plugin";

module.exports = defineConfig({
	videoCompression: 15,
	e2e: {
		setupNodeEvents(on, config) {
			return cloudPlugin(on, config);
		},
	},
});
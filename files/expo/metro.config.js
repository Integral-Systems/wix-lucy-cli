/* eslint-disable @typescript-eslint/no-require-imports */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = (() => {
	let config = getDefaultConfig(__dirname);
	const { transformer, resolver } = config;
	config.transformer = {
		...transformer,
	};
	config.resolver = {
		...resolver,
	};
	config.resolver.extraNodeModules = {
		...config.resolver.extraNodeModules,
		...require('node-libs-react-native'),
		'node:buffer': require.resolve('buffer/'),
		'node:crypto': require.resolve('react-native-crypto/'),
		'node:util': require.resolve('util/'),
		'node:http': require.resolve('stream-http/'),
		'node:https': require.resolve('https-browserify/'),
		'node:events': require.resolve('events/'),
	};
	
	return config;
})();
// console.log('Using Metro config:', JSON.stringify(config, null, 2));
module.exports = withNativeWind(config, { input: './global.css' });


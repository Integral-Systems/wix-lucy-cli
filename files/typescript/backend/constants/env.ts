export const environment = {
	gitTag: 'development',
	devMode: false,
	development: process.env.SEGMENT === 'dev' ? true : false,
} as const;

export type Environment = typeof environment;
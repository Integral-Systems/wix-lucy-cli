module.exports = {
	extends: ['eslint:recommended', 'plugin:import/recommended', 'plugin:jsdoc/recommended', 'plugin:@typescript-eslint/recommended'],
	plugins: ['simple-import-sort', 'eslint-plugin-named-import-spacing', '@typescript-eslint'],
	parser: '@typescript-eslint/parser',
	ignorePatterns: ['src/**/*', '**/types/backend/**/*', '**/types/pages/**/*', '**/types/public/**/*', '**/types/node/**/*', '.wix/**/*', 'coverage/**/*', 'docs/**/*'],
	rules: {
		quotes: [2, 'single', { 'avoidEscape': true, 'allowTemplateLiterals': true }],
		curly: ['error', 'multi-line'],
		'simple-import-sort/imports': 'error',
		'simple-import-sort/exports': 'error',
		indent: ['error', 'tab'],
		'no-tabs': 0,
		'semi-style': ['error', 'last'],
		semi: [2, 'always'],
		'object-curly-spacing': ['error', 'always'],
		'space-in-parens': ['error', 'never'],
		'newline-before-return': 'error',
		'space-before-blocks': ['error', { functions: 'always', keywords: 'never', classes: 'always' }],
		'comma-spacing': ['error', { before: false, after: true }],
		'no-multi-spaces': ['error'],
		'import/newline-after-import': ['error', { count: 1 }],
		'named-import-spacing/named-import-spacing': 2,
		'no-unused-vars': 'warn',
		'import/no-unresolved': [0],
		'no-forbidden-relative-imports': [0],
		'@typescript-eslint/triple-slash-reference': 'off',
		'@typescript-eslint/member-ordering': [
			'error',
			{ classes: ['constructor', 'private-instance-field', 'protected-instance-field', 'public-instance-field', 'public-instance-method', 'private-instance-method'] }
		],
		'@typescript-eslint/naming-convention': [
			'error',
			{
				selector: ['variable', 'function'],
				format: ['camelCase'],
				leadingUnderscore: 'allow'
			},
			{
				selector: ['objectLiteralProperty'],
				format: null,
				leadingUnderscore: 'allow'
			},
			{
				selector: 'memberLike',
				modifiers: ['private'],
				format: ['camelCase'],
				leadingUnderscore: 'require'
			},
			{
				selector: 'memberLike',
				modifiers: ['protected'],
				format: ['camelCase'],
				leadingUnderscore: 'require'
			},
			{
				selector: 'memberLike',
				modifiers: ['public'],
				format: ['camelCase'],
				leadingUnderscore: 'forbid'
			},
			{
				selector: ['parameterProperty', 'parameter'],
				format: ['camelCase'],
				leadingUnderscore: 'forbid'
			},
			{
				selector: 'default',
				format: ['UPPER_CASE'],
				leadingUnderscore: 'forbid',
				trailingUnderscore: 'forbid',
				custom: {
					regex: '^[A-Z_]+$',
					match: true
				}
			},
			{
				selector: 'typeLike',
				format: ['PascalCase']
			},
			// Custom rule added
			{
				selector: 'function',
				format: ['UPPER_CASE']
			}
		],
	},
	root: true,
	env: {
		es6: true,
		browser: true,
		node: true
	},
	globals: {
		$w: 'readonly'
	}
};

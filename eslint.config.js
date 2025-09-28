import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import { defineConfig } from 'eslint/config';

export default defineConfig([
	{
		ignores: [ 'utilities/romanNumeralConversion.js' ],
		linterOptions: {
			reportUnusedDisableDirectives: 'error',
			reportUnusedInlineConfigs: 'error'
		},
		extends: [ js.configs.recommended ],
		plugins: {
			'@stylistic': stylistic
		},
		rules: {
			'curly': 'warn',
			'default-case-last': 'error',
			'max-classes-per-file': [
				'error',
				{
					'ignoreExpressions': true
				}
			],
			'new-cap': 'error',
			'no-console': [
				'warn',
				{
					allow: [
						'group',
						'groupCollapsed',
						'groupEnd'
					]
				}
			],
			'no-eval': 'error',
			'no-extra-boolean-cast': 'error',
			'no-implied-eval': 'error',
			'no-invalid-this': 'error',
			'no-multi-assign': 'error',
			'no-param-reassign': 'error',
			'no-prototype-builtins': 'off',
			'no-shadow': 'error',
			'no-undef': 'off',
			'no-unexpected-multiline': 'off',
			'no-unused-vars': 'warn',
			'no-use-before-define': 'error',
			'no-useless-assignment': 'warn',
			'no-useless-rename': 'warn',
			'no-var': 'error',
			'prefer-const': 'warn',
			'prefer-destructuring': [
				'error',
				{
					'array': false,
					'object': true
				}
			],
			'prefer-template': 'warn',
			'require-atomic-updates': 'error',
			'require-await': 'warn',
			// 'sort-imports': 'warn',
			'yoda': 'error',
			'@stylistic/indent': [ 'error', 'tab' ],
			'@stylistic/no-mixed-spaces-and-tabs': 'error',
			'@stylistic/object-curly-spacing': [ 'error', 'always' ],
			'@stylistic/quotes': [
				'error',
				'single',
				{
					'allowTemplateLiterals': 'always'
				}
			],
			'@stylistic/semi': [ 'error', 'always' ],
		}
	}
]);
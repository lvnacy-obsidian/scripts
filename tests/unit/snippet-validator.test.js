// tests/unit/snippet-validator.test.js
import {
	test,
	describe,
	beforeEach
} from 'node:test';
import assert from 'node:assert';
import SnippetValidator from '../../tests/validators/snippet-validator.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('SnippetValidator', () => {
	let validator;
	let testFixturesDir;

	beforeEach(() => {
		validator = new SnippetValidator();
		testFixturesDir = path.join(__dirname, '../fixtures/valid-snippets');
	});

	describe('Metadata Validation', () => {
		test('should validate snippet with proper metadata', async () => {
			const content = `
				// @snippet-name: Test Snippet
				// @snippet-prefix: test-snippet
				// @snippet-description: A test snippet

				export function testFunction() {
					console.log('test');
				}
			`;

			const tempFile = path.join(testFixturesDir, 'test-metadata.ts');
			await fs.writeFile(tempFile, content);

			const result = await validator.validateFile(tempFile);

			assert.strictEqual(result.isValid, true);
			assert.strictEqual(result.errors.length, 0);

			await fs.unlink(tempFile);
		});

		test('should warn about missing metadata', async () => {
			const content = `
				export function testFunction() {
					console.log('test');
				}
			`;

			const tempFile = path.join(testFixturesDir, 'test-no-metadata.ts');
			await fs.writeFile(tempFile, content);

			const result = await validator.validateFile(tempFile);

			assert.strictEqual(result.warnings.length > 0, true);

			await fs.unlink(tempFile);
		});

		test('should error on invalid prefix format', async () => {
			const content = `
				// @snippet-name: Test Snippet
				// @snippet-prefix: Invalid_Prefix
				// @snippet-description: A test snippet

				export function testFunction() {};
			`;

			const tempFile = path.join(testFixturesDir, 'test-invalid-prefix.ts');
			await fs.writeFile(tempFile, content);

			const result = await validator.validateFile(tempFile);

			assert.strictEqual(result.isValid, false);
			assert.ok(result.errors.some((e) => e.message.includes('Prefix')));

			await fs.unlink(tempFile);
		});
	});

	describe('Syntax Validation', () => {
		test('should validate correct JavaScript syntax', async () => {
			const content = `
				const test = 'hello';
				function myFunction() {
					return test;
				}
			`;

			const tempFile = path.join(testFixturesDir, 'test-syntax.js');
			await fs.writeFile(tempFile, content);

			const result = await validator.validateFile(tempFile);

			assert.strictEqual(
				result.errors.filter((e) => e.message.includes('Syntax')).length,
				0
			);

			await fs.unlink(tempFile);
		});

		test('should detect syntax errors', async () => {
			const content = `
				const test = 'hello'
				function myFunction() {
					return test
				}
				}
			`; // Extra closing brace

			const tempFile = path.join(testFixturesDir, 'test-syntax-error.js');
			await fs.writeFile(tempFile, content);

			const result = await validator.validateFile(tempFile);

			assert.strictEqual(result.isValid, false);
			assert.ok(result.errors.some((e) => e.message.includes('Syntax')));

			await fs.unlink(tempFile);
		});
	});

	describe('Placeholder Validation', () => {
		test('should validate proper placeholder format', async () => {
			const content = `
				export function testFunction(\${PARAMETER_NAME}) {
					console.log(\${VARIABLE_NAME});
					\${CURSOR}
				}
			`;

			const tempFile = path.join(testFixturesDir, 'test-placeholders.js');
			await fs.writeFile(tempFile, content);

			const result = await validator.validateFile(tempFile);

			assert.strictEqual(result.errors.length, 0);

			await fs.unlink(tempFile);
		});
	});
});
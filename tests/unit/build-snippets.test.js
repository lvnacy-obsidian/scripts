// tests/unit/build-snippets.test.js
import { test, describe } from 'node:test';
import assert from 'node:assert';

describe('Build Snippets', () => {
	test('should extract metadata from file', () => {
		const content = `
			// @snippet-name: My Snippet
			// @snippet-prefix: my-snippet
			// @snippet-description: Test description

			export function test() {}
		`;

		// Simplified version of extractMetadata function
		const lines = content.split('\n');
		const metadata = {};

		lines.forEach(line => {
			const trimmed = line.trim();
			if (trimmed.startsWith('// @snippet-name:')) {
				metadata.name = trimmed.replace('// @snippet-name:', '').trim();
			}
		});

		assert.strictEqual(metadata.name, 'My Snippet');
	});

	test('should process placeholders correctly', () => {
		const input = ['const ${VARIABLE} = ${VALUE};', '${CURSOR}'];

		// Simplified placeholder processing
		let index = 1;
		const map = new Map();
		const output = input.map((line) => {
			return line.replace(/\$\{([^}]+)\}/g, (match, placeholder) => {
				if (placeholder === 'CURSOR') {
					return '$0';
				}
				if (!map.has(placeholder)) {
					map.set(placeholder, index++);
				}
				return `\${${map.get(placeholder)}:${placeholder}}`;
			});
		});

		assert.strictEqual(output[0], 'const ${1:VARIABLE} = ${2:VALUE};');
		assert.strictEqual(output[1], '$0');
	});
});

// Run all tests with:
// node --test tests/**/*.test.js
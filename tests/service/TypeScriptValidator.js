import ValidationResult from './ValidationResult';

/**
 * TypeScript-specific validator
 */
export default class TypeScriptValidator {
	static validate(content, filePath) {
		const result = new ValidationResult();

		if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) {
			return result; // Skip non-TypeScript files
		}

		// Check for proper type annotations
		const functionRegex = /function\s+\w+\s*\([^)]*\)(?:\s*:\s*\w+)?/g;
		let match;
		while ((match = functionRegex.exec(content)) !== null) {
			if (!match[0].includes(':')) {
				result.addWarning(`Function missing return type annotation: ${match[0]}`);
			}
		}

		// Check for any types
		if (content.includes(': any')) {
			result.addWarning(`Using 'any' type reduces type safety`);
		}

		// Check for proper interface/type imports
		if (content.includes('type {') || content.includes('import type')) {
			result.addInfo('Using TypeScript type-only imports');
		}

		// Check for async/await typing
		if (content.includes('async function') && !content.includes('Promise<')) {
			result.addWarning('Async function should have Promise return type');
		}

		return result;
	}
}
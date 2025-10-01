import ValidationResult from './ValidationResult';

/**
 * Performance validator
 */
export default class PerformanceValidator {
	static validate(content) {
		const result = new ValidationResult();

		// Check for synchronous file operations
		if (
			content.includes('fs.readFileSync') ||
			content.includes('fs.writeFileSync')
		) {
			result.addWarning('Using synchronous file operations can block the main thread');
		}

		// Check for unoptimized loops
		if (content.includes('forEach') && content.includes('await')) {
			result.addWarning('Using await inside forEach - consider Promise.all() or for...of');
		}

		// Check for large data operations
		if (content.includes('JSON.stringify') || content.includes('JSON.parse')) {
			result.addInfo('JSON operations detected - consider performance for large data');
		}

		// Check for recursive functions without safeguards
		const funcNameRegex = /function\s+(\w+)/g;
		let match;
		while ((match = funcNameRegex.exec(content)) !== null) {
			const funcName = match[1];
			const recursiveRegex = new RegExp(`\\b${funcName}\\s*\\(`, 'g');
			const matches = content.match(recursiveRegex);
			if (matches && matches.length > 1) {
				result.addInfo(`Potential recursive function: ${funcName}`);
			}
		}

		return result;
	}
}
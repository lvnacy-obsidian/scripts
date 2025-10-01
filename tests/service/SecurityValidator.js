import ValidationResult from './ValidationResult';

/**
 * Security validator
 */
export default class SecurityValidator {
	static validate(content) {
		const result = new ValidationResult();

		// Check for dangerous patterns
		const dangerousPatterns = [
			{
				pattern: /eval\s*\(/,
				message: 'Using eval() is dangerous'
			},
			{
				pattern: /new Function\s*\(/,
				message: 'Using new Function() can be dangerous',
			},
			{
				pattern: /innerHTML\s*=/,
				message: 'Using innerHTML can lead to XSS'
			},
			{
				pattern: /document\.write/,
				message: 'Using document.write is deprecated and unsafe',
			},
			{
				pattern: /window\.open\s*\(/,
				message: 'Consider security implications of window.open',
			}
		];

		dangerousPatterns.forEach(({ pattern, message }) => {
			if (pattern.test(content)) {
				result.addWarning(message);
			}
		});

		// Check for file system operations
		if (content.includes('fs.') || content.includes(`require('fs')`)) {
			result.addInfo('File system operations detected - ensure proper error handling');
		}

		// Check for external URLs
		const urlRegex = /https?:\/\/[^\s'']+/g;
		let match;
		while ((match = urlRegex.exec(content)) !== null) {
			result.addInfo(`External URL found: ${match[0]}`);
		}

		return result;
	}
}
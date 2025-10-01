import ValidationResult from './ValidationResult';

/**
 * Placeholder validator
 */
export default class PlaceholderValidator {
	static validate(content) {
		const result = new ValidationResult();
		const lines = content.split('\n');
		const placeholders = new Set();
		const placeholderRegex = /\$\{([^}]+)\}/g;

		lines.forEach((line, index) => {
			let match;
			while ((match = placeholderRegex.exec(line)) !== null) {
				const placeholder = match[1];
				placeholders.add(placeholder);

				// Validate placeholder format
				if (placeholder === '0') {
					result.addInfo('Found cursor position placeholder', index + 1);
				} else if (!/^[A-Z_][A-Z0-9_]*$/.test(placeholder)) {
					result.addWarning(
						`Placeholder '${placeholder}' should use UPPER_SNAKE_CASE`,
						index + 1
					);
				}

				// Check for descriptive placeholders
				if (placeholder.length < 3 && placeholder !== '0') {
					result.addWarning(
						`Placeholder '${placeholder}' is quite short, consider being more descriptive`,
						index + 1
					);
				}
			}
		});

		// Check for cursor placeholder
		if (!placeholders.has('0') && !placeholders.has('CURSOR')) {
			result.addWarning(
				'Consider adding a cursor position placeholder (${0} or ${CURSOR})'
			);
		}

		result.placeholders = Array.from(placeholders);
		return result;
	}
}
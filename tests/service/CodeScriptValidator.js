import ValidationResult from './ValidationResult';

/**
 * CodeScript-specific validator
 */
export default class CodeScriptValidator {
	static validate(content) {
		const result = new ValidationResult();

		// Check for CodeScript patterns
		if (content.includes('codeButtonContext')) {
			result.addInfo('Detected CodeScript code button pattern');

			// Validate code button structure
			if (content.includes('```code-button')) {
				if (!content.includes('---')) {
					result.addWarning('Code button missing YAML frontmatter');
				}
			}
		}

		if (
			content.includes('export async function invoke') ||
			content.includes('exports.invoke')
		) {
			result.addInfo('Detected CodeScript invocable pattern');

			// Check for proper App parameter
			if (!content.includes(': App') && !content.includes('(app)')) {
				result.addWarning('Invocable function should accept App parameter');
			}
		}

		if (content.includes('requireAsync') || content.includes('require(')) {
			result.addInfo('Detected CodeScript module usage');
		}

		return result;
	}
}
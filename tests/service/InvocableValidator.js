import ValidationResult from './ValidationResult';

/**
 * CodeScript invocable validator
 */
export default class InvocableValidator {
	static validate(content) {
		const result = new ValidationResult();

		// Check for invoke function
		const hasInvokeExport = /export\s+(async\s+)?function\s+invoke/.test(content);
		const hasInvokeAssignment = /exports\.invoke\s*=/.test(content);

		if (!hasInvokeExport && !hasInvokeAssignment) {
			result.addError('Script must export an invoke function to be invocable');
		} else {
			result.addInfo('Found invocable function export');
		}

		// Check for proper App parameter
		if (
			content.includes('invoke') &&
			!content.match(/invoke\s*\(\s*(app\s*:\s*App|app\s*\))/)
		) {
			result.addWarning('Invoke function should accept app parameter with proper typing');
		}

		// Check for cleanup function
		if (
			content.includes('export async function cleanup') ||
			content.includes('exports.cleanup')
		) {
			result.addInfo('Found cleanup function');
		}

		// Check for proper imports
		if (
			content.includes(': App') &&
			!content.includes('import') &&
			!content.includes('require')
		) {
			result.addError('Using App type but missing import statement');
		}

		// Validate async patterns
		if (content.includes('await') && !content.includes('async')) {
			result.addError('Using await without async function declaration');
		}

		return result;
	}
}
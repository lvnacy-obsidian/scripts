/**
 * Validation result structure
 */
export default class ValidationResult {
	constructor() {
		this.isValid = true;
		this.errors = [];
		this.warnings = [];
		this.info = [];
	}

	addError(message, line = null) {
		this.isValid = false;
		this.errors.push({ message, line, type: 'error' });
	}

	addWarning(message, line = null) {
		this.warnings.push({ message, line, type: 'warning' });
	}

	addInfo(message, line = null) {
		this.info.push({ message, line, type: 'info' });
	}

	get hasIssues() {
		return this.errors.length > 0 || this.warnings.length > 0;
	}

	getAllIssues() {
		return [...this.errors, ...this.warnings, ...this.info];
	}
}
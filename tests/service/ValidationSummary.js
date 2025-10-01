/**
 * Combined validation report
 */
export default class ValidationSummary {
	constructor() {
		this.snippetReport = null;
		this.scriptReport = null;
		this.startTime = Date.now();
		this.endTime = null;
	}

	finalize() {
		this.endTime = Date.now();
	}

	get duration() {
		return this.endTime - this.startTime;
	}

	get totalFiles() {
		const snippetFiles = this.snippetReport ? this.snippetReport.totalFiles : 0;
		const scriptFiles = this.scriptReport ? this.scriptReport.totalFiles : 0;
		return snippetFiles + scriptFiles;
	}

	get totalErrors() {
		const snippetErrors = this.snippetReport
			? this.snippetReport.totalErrors
			: 0;
		const scriptErrors = this.scriptReport ? this.scriptReport.totalErrors : 0;
		return snippetErrors + scriptErrors;
	}

	get totalWarnings() {
		const snippetWarnings = this.snippetReport
			? this.snippetReport.totalWarnings
			: 0;
		const scriptWarnings = this.scriptReport
			? this.scriptReport.totalWarnings
			: 0;
		return snippetWarnings + scriptWarnings;
	}

	get isValid() {
		const snippetValid = this.snippetReport
			? this.snippetReport.totalErrors === 0
			: true;
		const scriptValid = this.scriptReport
			? this.scriptReport.totalErrors === 0
			: true;
		return snippetValid && scriptValid;
	}
}
import fs from 'fs/promises';
import path from 'path';
import { Log } from '../../library/utilities/logger-node-scripts.js';

// import support classes
import CodeScriptValidator from '../service/CodeScriptValidator.js';
import PlaceholderValidator from '../service/PlaceholderValidator.js';
import SnippetMetadataValidator from '../service/SnippetMetadataValidator.js';
import SyntaxValidator from '../service/SyntaxValidator.js';
import ValidationResult from '../service/ValidationResult.js';

// Validation context
const logContext = {
	context: 'snippet-validator.js',
	path: 'tests/validators/snippet-validator.js',
};

/**
 * Main snippet validator
 */
export default class SnippetValidator {
	constructor(options = {}) {
		this.options = {
			validateSyntax: true,
			validateMetadata: true,
			validatePlaceholders: true,
			validateCodeScript: true,
			strictMode: false,
			...options,
		};
	}

	async validateFile(filePath) {
		const result = new ValidationResult();
		result.filePath = filePath;

		try {
			const content = await fs.readFile(filePath, 'utf8');
			const validationResults = [];

			// Run all validators
			if (this.options.validateMetadata) {
				validationResults.push(
					SnippetMetadataValidator.validate(content)
				);
			}

			if (this.options.validateSyntax) {
				validationResults.push(
					await SyntaxValidator.validate(content, filePath)
				);
			}

			if (this.options.validatePlaceholders) {
				validationResults.push(
					PlaceholderValidator.validate(content)
				);
			}

			if (this.options.validateCodeScript) {
				validationResults.push(
					CodeScriptValidator.validate(content)
				);
			}

			// Merge results
			validationResults.forEach((vResult) => {
				result.errors.push(...vResult.errors);
				result.warnings.push(...vResult.warnings);
				result.info.push(...vResult.info);
				if (!vResult.isValid) {
					result.isValid = false;
				}
			});
		} catch (error) {
			result.addError(`Failed to read file: ${error.message}`);
		}

		return result;
	}

	async validateDirectory(
		dirPath,
		extensions = ['.js', '.ts', '.jsx', '.tsx']
	) {
		const results = [];

		try {
			const entries = await fs.readdir(dirPath, { withFileTypes: true });

			for (const entry of entries) {
				const fullPath = path.join(dirPath, entry.name);

				if (entry.isDirectory()) {
					const subResults = await this.validateDirectory(fullPath, extensions);
					results.push(...subResults);
				} else if (extensions.includes(path.extname(entry.name))) {
					const result = await this.validateFile(fullPath);
					results.push(result);
				}
			}
		} catch (error) {
			Log.error(
				logContext,
				`Failed to validate directory ${dirPath}:`,
				error.message
			);
		}

		return results;
	}

	generateReport(results) {
		const report = {
			totalFiles: results.length,
			validFiles: results.filter(r => r.isValid).length,
			filesWithWarnings: results.filter(r => r.warnings.length > 0).length,
			filesWithErrors: results.filter(r => r.errors.length > 0).length,
			totalErrors: results.reduce((sum, r) => sum + r.errors.length, 0),
			totalWarnings: results.reduce((sum, r) => sum + r.warnings.length, 0),
			results: results,
		};

		return report;
	}

	printReport(report) {
		Log.info(logContext, '📊 Snippet Validation Report');
		Log.info(logContext, '================================');
		Log.info(logContext, `Total files: ${report.totalFiles}`);
		Log.info(logContext, `Valid files: ${report.validFiles}`);
		Log.info(logContext, `Files with warnings: ${report.filesWithWarnings}`);
		Log.info(logContext, `Files with errors: ${report.filesWithErrors}`);
		Log.info(logContext, `Total warnings: ${report.totalWarnings}`);
		Log.info(logContext, `Total errors: ${report.totalErrors}`);
		Log.info(logContext, '');

		// Print detailed issues
		report.results.forEach((result) => {
			if (result.hasIssues) {
				const relativePath = path.relative(process.cwd(), result.filePath);
				Log.info(logContext, `📄 ${relativePath}`);

				result.getAllIssues().forEach(issue => {
					const icon =
						issue.type === 'error'
							? '❌'
							: issue.type === 'warning'
								? '⚠️'
								: 'ℹ️';
					const location = issue.line ? `:${issue.line}` : '';
					Log.info(logContext, `  ${ icon } ${ issue.message }${ location }`);
				});

				Log.info(logContext, '');
			}
		});
	}
}

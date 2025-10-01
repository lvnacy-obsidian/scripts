import fs from 'fs/promises';
import path from 'path';
import { Log } from '../../library/utilities/logger-node-scripts.js';

// import support classes
import DependencyValidator from '../service/DependencyValidator.js';
import InvocableValidator from '../service/InvocableValidator.js';
import PerformanceValidator from '../service/PerformanceValidator.js';
import SecurityValidator from '../service/SecurityValidator.js';
import TypeScriptValidator from '../service/TypeScriptValidator.js';

// Validation context
const logContext = {
	context: 'script-validator.js',
	path: 'tests/validators/script-validator.js',
};

/**
 * Main script validator
 */
export default class ScriptValidator {
	constructor(options = {}) {
		this.options = {
			validateInvocable: true,
			validateDependencies: true,
			validateTypeScript: true,
			validateSecurity: true,
			validatePerformance: true,
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

			// Basic syntax validation first
			try {
				const ext = path.extname(filePath);
				if (['.ts', '.tsx'].includes(ext)) {
					const { parse } = await import('@typescript-eslint/typescript-estree');
					parse(content, {
						errorOnTypeScriptSyntacticAndSemanticIssues: false,
					});
				} else {
					const { parse } = await import('@babel/parser');
					parse(content, {
						sourceType: 'module',
						allowImportExportEverywhere: true,
						plugins: ['typescript', 'jsx'],
					});
				}
			} catch (syntaxError) {
				result.addError(`Syntax error: ${syntaxError.message}`);
				return result; // Don't continue if syntax is broken
			}

			// Run specific validators
			if (this.options.validateInvocable) {
				validationResults.push(InvocableValidator.validate(content));
			}

			if (this.options.validateDependencies) {
				validationResults.push(DependencyValidator.validate(content));
			}

			if (this.options.validateTypeScript) {
				validationResults.push(TypeScriptValidator.validate(content, filePath));
			}

			if (this.options.validateSecurity) {
				validationResults.push(SecurityValidator.validate(content));
			}

			if (this.options.validatePerformance) {
				validationResults.push(PerformanceValidator.validate(content));
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
			result.addError(`Failed to validate file: ${error.message}`);
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
			invocableFiles: results.filter(r => {
				r.info.some((info) => info.message.includes('invocable'));
			}).length,
			results: results,
		};

		return report;
	}

	printReport(report) {
		Log.info(logContext, '🔍 Script Validation Report');
		Log.info(logContext, '============================');
		Log.info(logContext, `Total files: ${report.totalFiles}`);
		Log.info(logContext, `Valid files: ${report.validFiles}`);
		Log.info(logContext, `Invocable files: ${report.invocableFiles}`);
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

				result.getAllIssues().forEach((issue) => {
					const icon =
						issue.type === 'error'
							? '❌'
							: issue.type === 'warning'
								? '⚠️'
								: 'ℹ️';
					const location = issue.line ? `:${issue.line}` : '';
					Log.info(logContext, `  ${icon} ${issue.message}${location}`);
				});

				Log.info(logContext, '');
			}
		});
	}
}

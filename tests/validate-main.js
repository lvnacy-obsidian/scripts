#!/usr/bin/env node
/* eslint-disable no-console */
import { Log } from '../library/utilities/logger-node-scripts.js';
import SnippetValidator from './tests/validators/snippet-validator.js';
import ScriptValidator from './tests/validators/script-validator.js';
import ValidationSummary from './service/ValidationSummary.js';

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Validation context
const logContext = {
	context: 'validate-main.js',
	path: 'validate-main.js',
};

// Configuration
const CONFIG = {
	snippetsDir: path.join(__dirname, 'library'),
	scriptsDir: path.join(__dirname, 'library', 'scripts'),
	outputDir: path.join(__dirname, 'test-results'),
	extensions: ['.js', '.ts', '.jsx', '.tsx'],
};

/**
 * Validate snippets in the library directory
 */
async function validateSnippets(options = {}) {
	Log.info(logContext, '🔍 Validating snippet library...');

	const validator = new SnippetValidator({
		validateSyntax: options.syntax !== false,
		validateMetadata: options.metadata !== false,
		validatePlaceholders: options.placeholders !== false,
		validateCodeScript: options.codescript !== false,
		strictMode: options.strict || false,
	});

	const results = await validator.validateDirectory(
		CONFIG.snippetsDir,
		CONFIG.extensions
	);
	const report = validator.generateReport(results);

	if (options.verbose || report.totalErrors > 0 || report.totalWarnings > 0) {
		validator.printReport(report);
	}

	return report;
}

/**
 * Validate scripts in the scripts directory
 */
async function validateScripts(options = {}) {
	Log.info(logContext, '🔍 Validating script library...');

	// Check if scripts directory exists
	try {
		await fs.access(CONFIG.scriptsDir);
	} catch {
		Log.info(
			logContext,
			'No scripts directory found, skipping script validation'
		);
		return null;
	}

	const validator = new ScriptValidator({
		validateInvocable: options.invocable !== false,
		validateDependencies: options.dependencies !== false,
		validateTypeScript: options.typescript !== false,
		validateSecurity: options.security !== false,
		validatePerformance: options.performance !== false,
		strictMode: options.strict || false,
	});

	const results = await validator.validateDirectory(
		CONFIG.scriptsDir,
		CONFIG.extensions
	);
	const report = validator.generateReport(results);

	if (options.verbose || report.totalErrors > 0 || report.totalWarnings > 0) {
		validator.printReport(report);
	}

	return report;
}

/**
 * Generate JSON report file
 */
async function saveReport(summary, options) {
	if (!options.saveReport) {
		return;
	}

	await fs.mkdir(CONFIG.outputDir, { recursive: true });

	const reportData = {
		timestamp: new Date().toISOString(),
		duration: summary.duration,
		summary: {
			totalFiles: summary.totalFiles,
			totalErrors: summary.totalErrors,
			totalWarnings: summary.totalWarnings,
			isValid: summary.isValid
		},
		snippets: summary.snippetReport,
		scripts: summary.scriptReport
	};

	const reportPath = path.join(
		CONFIG.outputDir,
		`validation-report-${Date.now()}.json`
	);
	await fs.writeFile(reportPath, JSON.stringify(reportData, null, 2));

	Log.info(logContext, `📊 Validation report saved to: ${reportPath}`);
}

/**
 * Helper function to generate HTML report sections
 */
function generateReportSection(title, report) {
	if (!report || !report.results || report.results.length === 0) {
		return '';
	}

	const filesWithIssues = report.results.filter((r) => r.hasIssues);

	return `
		<h2>${title}</h2>
		${filesWithIssues
			.map(
				(result) => `
				<div class='file-results'>
					<div class='file-header'>
						<strong>${path.relative(
							process.cwd(),
							result.filePath
						)}</strong>
					</div>
					<div class='issues'>
						${result
							.getAllIssues()
							.map((issue) => {`
								<div class='issue ${issue.type}'>
								${
									issue.type === 'error'
										? '❌'
										: issue.type === 'warning'
											? '⚠️'
											: 'ℹ️'
								} 
								${issue.message}
								${issue.line ? ` (line ${issue.line})` : ''}
								</div>
							`;})
							.join('')}
					</div>
				</div>
			`
			)
			.join('')}`;
}

/**
 * Generate HTML report
 */
async function generateHtmlReport(summary, options) {
	if (!options.htmlReport) {
		return;
	}

	const htmlTemplate = `
		<!DOCTYPE html>
		<html lang='en'>
		<head>
			<meta charset='UTF-8'>
			<meta name='viewport' content='width=device-width, initial-scale=1.0'>
			<title>Validation Report</title>
			<style>
				body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 20px; }
				.header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
				.summary { display: flex; gap: 20px; margin-bottom: 20px; }
				.metric { background: white; padding: 15px; border-radius: 6px; border: 1px solid #e1e5e9; flex: 1; }
				.metric h3 { margin: 0 0 5px 0; color: #586069; font-size: 14px; }
				.metric .value { font-size: 24px; font-weight: 600; }
				.error .value { color: #d73a49; }
				.warning .value { color: #f66a0a; }
				.success .value { color: #28a745; }
				.file-results { background: white; border: 1px solid #e1e5e9; border-radius: 6px; margin-bottom: 10px; }
				.file-header { padding: 15px; border-bottom: 1px solid #e1e5e9; background: #fafbfc; }
				.issues { padding: 15px; }
				.issue { margin: 5px 0; padding: 5px 0; }
				.issue.error { color: #d73a49; }
				.issue.warning { color: #f66a0a; }
				.issue.info { color: #586069; }
			</style>
		</head>
		<body>
			<div class='header'>
				<h1>🔍 Validation Report</h1>
				<p>Generated on ${new Date().toLocaleString()}</p>
				<p>Duration: ${summary.duration}ms</p>
			</div>
			
			<div class='summary'>
				<div class='metric'>
					<h3>Total Files</h3>
					<div class='value'>${summary.totalFiles}</div>
				</div>
				<div class='metric ${summary.totalErrors > 0 ? 'error' : 'success'}'>
					<h3>Errors</h3>
					<div class='value'>${summary.totalErrors}</div>
				</div>
				<div class='metric ${
					summary.totalWarnings > 0 ? 'warning' : 'success'
				}'>
					<h3>Warnings</h3>
					<div class='value'>${summary.totalWarnings}</div>
				</div>
				<div class='metric ${summary.isValid ? 'success' : 'error'}'>
					<h3>Status</h3>
					<div class='value'>${
						summary.isValid ? '✅ Valid' : '❌ Issues'
					}</div>
				</div>
			</div>
			
			${ generateReportSection('Snippets', summary.snippetReport) }
			${ generateReportSection('Scripts', summary.scriptReport) }
		</body>
		</html>
	`;

	const htmlPath = path.join(
		CONFIG.outputDir,
		`validation-report-${Date.now()}.html`
	);
	await fs.writeFile(htmlPath, htmlTemplate);

	Log.info(logContext, `📄 HTML report saved to: ${htmlPath}`);
}

/**
 * Print final summary
 */
function printSummary(summary) {
	Log.info(logContext, '');
	Log.info(logContext, '═══════════════════════════════════');
	Log.info(logContext, '📊 VALIDATION SUMMARY');
	Log.info(logContext, '═══════════════════════════════════');
	Log.info(logContext, `Total files processed: ${summary.totalFiles}`);
	Log.info(logContext, `Total errors: ${summary.totalErrors}`);
	Log.info(logContext, `Total warnings: ${summary.totalWarnings}`);
	Log.info(logContext, `Duration: ${summary.duration}ms`);

	if (summary.isValid) {
		Log.info(logContext, '✅ All validations passed!');
	} else {
		Log.error(logContext, '❌ Validation failed - please fix the errors above');
	}

	Log.info(logContext, '═══════════════════════════════════');
}

/**
 * Parse command line arguments
 */
function parseArgs() {
	const args = process.argv.slice(2);
	const options = {
		snippets: !args.includes('--no-snippets'),
		scripts: !args.includes('--no-scripts'),
		syntax: !args.includes('--no-syntax'),
		metadata: !args.includes('--no-metadata'),
		placeholders: !args.includes('--no-placeholders'),
		codescript: !args.includes('--no-codescript'),
		invocable: !args.includes('--no-invocable'),
		dependencies: !args.includes('--no-dependencies'),
		typescript: !args.includes('--no-typescript'),
		security: !args.includes('--no-security'),
		performance: !args.includes('--no-performance'),
		verbose: args.includes('--verbose') || args.includes('-v'),
		strict: args.includes('--strict'),
		saveReport: args.includes('--save-report'),
		htmlReport: args.includes('--html-report'),
		help: args.includes('--help') || args.includes('-h'),
	};

	return options;
}

/**
 * Print help information
 */
function printHelp() {
	console.log(`
		🔍 Validation Tool for Obsidian Scripts

		Usage: node validate-main.js [options]

		Options:
		--no-snippets        Skip snippet validation
		--no-scripts         Skip script validation
		--no-syntax          Skip syntax validation
		--no-metadata        Skip metadata validation
		--no-placeholders    Skip placeholder validation
		--no-codescript      Skip CodeScript validation
		--no-invocable       Skip invocable validation
		--no-dependencies    Skip dependency validation
		--no-typescript      Skip TypeScript validation
		--no-security        Skip security validation
		--no-performance     Skip performance validation
		--verbose, -v        Show detailed output
		--strict             Enable strict mode
		--save-report        Save JSON report
		--html-report        Generate HTML report
		--help, -h           Show this help

		Examples:
		node validate-main.js                    # Full validation
		node validate-main.js --verbose          # Verbose output
		node validate-main.js --no-performance   # Skip performance checks
		node validate-main.js --strict           # Strict mode
		node validate-main.js --html-report      # Generate HTML report
	`);
}

/**
 * Main validation function
 */
async function main() {
	const options = parseArgs();

	if (options.help) {
		printHelp();
		process.exit(0);
	}

	Log.info(logContext, '🚀 Starting validation process...');

	const summary = new ValidationSummary();

	try {
		// Validate snippets
		if (options.snippets) {
			summary.snippetReport = await validateSnippets(options);
		}

		// Validate scripts
		if (options.scripts) {
			summary.scriptReport = await validateScripts(options);
		}

		summary.finalize();

		// Generate reports
		await saveReport(summary, options);
		await generateHtmlReport(summary, options);

		// Print final summary
		printSummary(summary);

		// Exit with appropriate code
		process.exit(summary.isValid ? 0 : 1);
	} catch (error) {
		Log.error(logContext, 'Validation failed with error:', error.message);
		console.error(error);
		process.exit(1);
	}
}

// Run if called directly
if (process.argv[1] === __filename) {
	main();
}

export {
	validateSnippets,
	validateScripts,
	ValidationSummary
};

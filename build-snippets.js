#!/usr/bin/env node

import { Log } from './library/utilities/logger-obsidian-scripts.js';

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Context for logging
const logContext = {
	context: 'build-snippets.js',
	path: 'js/build-snippets.js',
};

// Configuration
const CONFIG = {
	libraryDir: path.join(__dirname, 'library'),
	outputDir: path.join(__dirname, '.vscode', 'snippets'),
	configFile: path.join(__dirname, 'snippet-config.json'),
	languages: {
		javascript: { ext: ['.js'], output: 'javascript.json' },
		typescript: { ext: ['.ts'], output: 'typescript.json' },
		jsx: { ext: ['.jsx'], output: 'javascriptreact.json' },
		tsx: { ext: ['.tsx'], output: 'typescriptreact.json' },
	},
};

/**
 * Extract snippet metadata from file comments
 * Expected format:
 * // @snippet-name: my-snippet
 * // @snippet-prefix: my-prefix
 * // @snippet-description: Description of the snippet
 */
function extractMetadata(content, filePath) {
	const lines = content.split('\n');
	const metadata = {};

	// Extract from comment blocks
	lines.forEach((line) => {
		const trimmed = line.trim();
		if (trimmed.startsWith('// @snippet-name:')) {
			metadata.name = trimmed.replace('// @snippet-name:', '').trim();
		} else if (trimmed.startsWith('// @snippet-prefix:')) {
			metadata.prefix = trimmed.replace('// @snippet-prefix:', '').trim();
		} else if (trimmed.startsWith('// @snippet-description:')) {
			metadata.description = trimmed
				.replace('// @snippet-description:', '')
				.trim();
		}
	});

	// Generate defaults if not provided
	const fileName = path.basename(filePath, path.extname(filePath));
	metadata.name =
		metadata.name ||
		fileName.replace(/[-_]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
	metadata.prefix =
		metadata.prefix ||
		fileName
			.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
			.replace(/^-/, '');
	metadata.description = metadata.description || `${metadata.name} snippet`;

	return metadata;
}

/**
 * Clean content by removing metadata comments and formatting for snippets
 */
function cleanContent(content) {
	const lines = content.split('\n');
	const cleaned = lines
		.filter((line) => {
			const trimmed = line.trim();
			// Keep lines that don't start with snippet metadata comments
			return !trimmed.startsWith('// @snippet-');
		})
		.filter((line) => line !== undefined); // Remove undefined entries

	// Remove leading/trailing empty lines
	while (cleaned.length > 0 && cleaned[0].trim() === '') {
		cleaned.shift();
	}
	while (cleaned.length > 0 && cleaned[cleaned.length - 1].trim() === '') {
		cleaned.pop();
	}

	return cleaned;
}

/**
 * Process placeholders in content
 * Converts ${PLACEHOLDER} to VS Code snippet format ${1:PLACEHOLDER}
 */
function processPlaceholders(lines) {
	let placeholderIndex = 1;
	const placeholderMap = new Map();

	return lines.map((line) => {
		return line.replace(/\$\{([^}]+)\}/g, (match, placeholder) => {
			if (placeholder === '0') {
				return '$0'; // Final cursor position
			}

			if (!placeholderMap.has(placeholder)) {
				placeholderMap.set(placeholder, placeholderIndex++);
			}

			const index = placeholderMap.get(placeholder);
			return `\${${index}:${placeholder}}`;
		});
	});
}

/**
 * Recursively find all files with given extensions
 */
async function findFiles(dir, extensions) {
	const files = [];

	try {
		const entries = await fs.readdir(dir, { withFileTypes: true });

		for (const entry of entries) {
			const fullPath = path.join(dir, entry.name);

			if (entry.isDirectory()) {
				const subFiles = await findFiles(fullPath, extensions);
				files.push(...subFiles);
			} else if (extensions.includes(path.extname(entry.name))) {
				files.push(fullPath);
			}
		}
	} catch (error) {
		Log.warn(
			logContext,
			`Warning: Could not read directory ${dir}:`,
			error.message
		);
	}

	return files;
}

/**
 * Load additional configuration from snippet-config.json
 */
async function loadConfig() {
	try {
		const configContent = await fs.readFile(CONFIG.configFile, 'utf8');
		return JSON.parse(configContent);
	} catch (error) {
		Log.error(logContext, 'No additional config found, using defaults', error);
		return {
			globalSnippets: {},
			languageOverrides: {}
		};
	}
}

/**
 * Generate snippets for a specific language
 */
async function generateLanguageSnippets(language, config) {
	Log.info(logContext, `Processing ${language} files...`);

	const langConfig = CONFIG.languages[language];
	const languageDir = path.join(CONFIG.libraryDir, language);

	// Check if language directory exists
	try {
		await fs.access(languageDir);
	} catch (error) {
		Log.error(logContext, `No ${ language } directory found, skipping...`, error);
		return;
	}

	const files = await findFiles(languageDir, langConfig.ext);
	const snippets = {};

	// Add global snippets for this language
	const globalSnippets = config.globalSnippets[language] || {};
	Object.assign(snippets, globalSnippets);

	// Process files in parallel for better performance
	const filePromises = files.map(async (filePath) => {
		try {
			const content = await fs.readFile(filePath, 'utf8');
			const metadata = extractMetadata(content, filePath);
			const cleanedLines = cleanContent(content);
			const processedLines = processPlaceholders(cleanedLines);

			Log.info(logContext, `  ✓ ${metadata.prefix} -> ${metadata.name}`);

			return {
				name: metadata.name,
				snippet: {
					prefix: metadata.prefix,
					body: processedLines,
					description: metadata.description
				}
			};
		} catch (error) {
			Log.error(logContext, `  ✗ Error processing ${filePath}:`, error.message);
			return null; // Return null for failed files
		}
	});

	// Wait for all files to be processed
	const results = await Promise.all(filePromises);

	// Build snippets object from results
	results
		.filter((result) => result !== null) // Remove failed files
		.forEach(({ name, snippet }) => {
			snippets[name] = snippet;
		});

	// Write output file
	const outputPath = path.join(CONFIG.outputDir, langConfig.output);
	await fs.mkdir(CONFIG.outputDir, { recursive: true });
	await fs.writeFile(outputPath, JSON.stringify(snippets, null, 2));

	const count = Object.keys(snippets).length;
	Log.info(logContext, `  Generated ${count} snippets -> ${langConfig.output}`);
}

/**
 * Main build function
 */
async function buildSnippets() {
	Log.info(logContext, '🔧 Building VS Code snippets from library files...');

	const startTime = Date.now();
	const config = await loadConfig();

	// Process each language in parallel for better performance
	const languagePromises = Object.keys(CONFIG.languages).map((language) =>
		generateLanguageSnippets(language, config)
	);

	await Promise.all(languagePromises);

	const endTime = Date.now();
	Log.info(logContext, `✅ Build complete in ${endTime - startTime}ms`);
	Log.info(logContext, `📁 Snippets saved to: ${CONFIG.outputDir}`);
}

/**
 * Watch mode for development
 */
async function watchMode() {
	Log.info(logContext, '👀 Starting watch mode...');
	Log.info(logContext, 'Press Ctrl+C to stop');

	// Initial build
	await buildSnippets();

	// Set up file watching (simplified version)
	const chokidar = await import('chokidar').catch(() => null);

	if (chokidar) {
		const watcher = chokidar.default.watch(CONFIG.libraryDir, {
			ignored: /node_modules/,
			persistent: true
		});

		let buildTimeout;
		watcher.on('change', (filePath) => {
			Log.info(logContext, `📝 File changed: ${filePath}`);
			clearTimeout(buildTimeout);
			buildTimeout = setTimeout(buildSnippets, 500); // Debounce
		});
	} else {
		Log.info(
			logContext,
			'Install chokidar for automatic rebuilding: npm install chokidar'
		);
		Log.info(
			logContext,
			'For now, run this script manually when files change.'
		);
	}
}

// CLI handling
const args = process.argv.slice(2);
const isWatchMode = args.includes('--watch') || args.includes('-w');

if (isWatchMode) {
	watchMode().catch((error) => Log.error(logContext, 'Watchmode error', error));
} else {
	buildSnippets().catch((error) =>
		Log.error(logContext, 'Error building snippets', error)
	);
}

import ValidationResult from './ValidationResult';

/**
 * Import/dependency validator
 */
export default class DependencyValidator {
	static validate(content) {
		const result = new ValidationResult();
		const dependencies = new Set();

		// Extract import statements
		const importRegex = /import\s+(?:{[^}]+}|\w+|\*\s+as\s+\w+)\s+from\s+['']([^'']+)['']/g;
		const requireRegex = /require\s*\(\s*['']([^'']+)['']\s*\)/g;
		const requireAsyncRegex = /requireAsync\s*\(\s*['']([^'']+)['']\s*\)/g;

		let match;
		while ((match = importRegex.exec(content)) !== null) {
			dependencies.add(match[1]);
		}
		while ((match = requireRegex.exec(content)) !== null) {
			dependencies.add(match[1]);
		}
		while ((match = requireAsyncRegex.exec(content)) !== null) {
			dependencies.add(match[1]);
		}

		// Validate Obsidian API usage
		if (content.includes('Notice') && !dependencies.has('obsidian')) {
			result.addError('Using Notice without importing from obsidian');
		}

		if (content.includes('TFile') && !dependencies.has('obsidian')) {
			result.addError('Using TFile without importing from obsidian');
		}

		if (content.includes('Plugin') && !dependencies.has('obsidian')) {
			result.addError('Using Plugin without importing from obsidian');
		}

		// Check for relative imports
		Array.from(dependencies).forEach((dep) => {
			if (dep.startsWith('./') || dep.startsWith('../')) {
				result.addInfo(`Relative import found: ${dep}`);
			} else if (dep.startsWith('/')) {
				result.addInfo(`Root-relative import found: ${dep}`);
			} else if (dep.startsWith('//')) {
				result.addInfo(`Vault-relative import found: ${dep}`);
			}
		});

		result.dependencies = Array.from(dependencies);
		return result;
	}
}
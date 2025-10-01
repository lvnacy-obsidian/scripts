

/**
 * Snippet metadata validator
 */
export default class SnippetMetadataValidator {

	static validate(content) {
		const result = new ValidationResult();
		const lines = content.split('\n');
		const metadata = {
			name: null,
			prefix: null,
			description: null,
		};

		// Check for required metadata
		let hasMetadata = false;
		lines.forEach(line => {
			const trimmed = line.trim();
			if (trimmed.startsWith('// @snippet-')) {
				hasMetadata = true;
				if (trimmed.startsWith('// @snippet-name:')) {
					metadata.name = trimmed.replace('// @snippet-name:', '').trim();
				} else if (trimmed.startsWith('// @snippet-prefix:')) {
					metadata.prefix = trimmed.replace('// @snippet-prefix:', '').trim();
				} else if (trimmed.startsWith('// @snippet-description:')) {
					metadata.description = trimmed
						.replace('// @snippet-description:', '')
						.trim();
				}
			}
		});

		// Validate metadata presence
		if (!hasMetadata) {
			result.addWarning(
				'No snippet metadata found. Using defaults from filename.'
			);
		}

		// Validate prefix format
		if (metadata.prefix) {
			if (!/^[a-z0-9-]+$/.test(metadata.prefix)) {
				result.addError(
					'Prefix should contain only lowercase letters, numbers, and hyphens'
				);
			}
			if (metadata.prefix.length < 2) {
				result.addError('Prefix should be at least 2 characters long');
			}
			if (metadata.prefix.length > 30) {
				result.addWarning(
					'Prefix is quite long, consider shortening for better UX'
				);
			}
		}

		// Validate description
		if (metadata.description && metadata.description.length > 100) {
			result.addWarning(
				'Description is quite long, consider making it more concise'
			);
		}

		result.metadata = metadata;
		return result;
	}
}
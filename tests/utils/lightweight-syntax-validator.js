export class LightweightSyntaxValidator {
	static validate(content) {
		const result = new ValidationResult();

		// Basic syntax checks without heavy parsers
		const checks = [
			{
				regex: /^import.*from.*$/, message: 'ES6 imports detected'
			},
			{
				regex: /function\s+\w+\s*\([^)]*\)\s*{/,
				message: 'Function syntax OK',
			},
			{
				regex: /\bawait\b.*(?!async)/,
				message: 'Await without async detected',
			},
			{
				regex: /[{}]/, pairs: this.checkBracePairs(content)
			},
		];

		checks.forEach((check) => {
			if (check.regex && check.regex.test(content)) {
				result.addInfo(check.message);
			}
		});

		return result;
	}

	static checkBracePairs(content) {
		let braceCount = 0;
		for (const char of content) {
			if (char === '{') {
				braceCount++;
			}

			if (char === '}') {
				braceCount--;
			}

			if (braceCount < 0) {
				return false;
			}
		}
		return braceCount === 0;
	}
}

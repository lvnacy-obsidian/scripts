import ValidationResult from './ValidationResult';

/**
 * Syntax validator using AST parsing
 */
export default class SyntaxValidator {
	static async validate(content, filePath) {
		const result = new ValidationResult();
		const ext = path.extname(filePath);

		try {
		// Import parser based on file type
			let parser;
			if (['.ts', '.tsx'].includes(ext)) {
				const { parse } = await import('@typescript-eslint/typescript-estree');
				parser = code => {
					parse(code, {
						loc: true,
						range: true,
						tokens: true,
						errorOnUnknownASTType: false,
						errorOnTypeScriptSyntacticAndSemanticIssues: false,
					});
				};
			} else {
				const { parse } = await import('@babel/parser');
				parser = code => {
					parse(code, {
						sourceType: 'module',
						allowImportExportEverywhere: true,
						allowReturnOutsideFunction: true,
						plugins: ['jsx', 'typescript'],
					});
				};
			}

			const ast = parser(content);
			result.addInfo('Syntax validation passed');
			result.ast = ast;
		} catch (error) {
			if (error.loc) {
				result.addError(`Syntax error: ${error.message}`, error.loc.line);
			} else {
				result.addError(`Syntax error: ${error.message}`);
			}
		}

		return result;
	}
}
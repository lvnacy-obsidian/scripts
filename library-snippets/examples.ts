// Example: library/typescript/codescript/invocable-typed.ts
// @snippet-name: CodeScript TypeScript Invocable
// @snippet-prefix: cs-ts-invoke
// @snippet-description: Type-safe invocable function for CodeScript

import type { App } from 'obsidian';
import { Notice } from 'obsidian';
import { Log } from '../utilities/logger-obsidian-scripts.js';

export async function invoke(app: App): Promise<void> {
	${IMPLEMENTATION}
	${CURSOR}
}

// Example: library/javascript/obsidian-api/get-active-file.js
// @snippet-name: Get Active File
// @snippet-prefix: obs-active-file
// @snippet-description: Get the currently active file with null check

const activeFile = this.app.workspace.getActiveFile();
if (!activeFile) {
	new Notice('No active file');
	return;
}
${CURSOR}

// Example: library/typescript/codescript/advanced-button.ts
// @snippet-name: Advanced CodeScript Button
// @snippet-prefix: cs-advanced-button
// @snippet-description: Advanced code button with full TypeScript support

```code-button
---
caption: ${BUTTON_CAPTION}
shouldAutoOutput: false
shouldWrapConsole: true
shouldAutoRun: ${AUTO_RUN}
isRaw: ${IS_RAW}
---
import type { App, TFile } from 'obsidian';

// Access CodeScript context
const { app, sourceFile, container } = codeButtonContext;

// Your advanced logic here
${IMPLEMENTATION}

// Render results
await codeButtonContext.renderMarkdown(`**Result:** \${${RESULT}}`);
${CURSOR}
```

// Example: library/typescript/obsidian-api/plugin-boilerplate.ts
// @snippet-name: TypeScript Plugin Boilerplate
// @snippet-prefix: obs-ts-plugin
// @snippet-description: Complete TypeScript plugin structure

import { Plugin, TFile } from 'obsidian';

export default class ${PLUGIN_NAME} extends Plugin {
	async onload(): Promise<void> {
		console.log('Loading ${PLUGIN_NAME}');
		${INITIALIZATION}
	}

	onunload(): void {
		console.log('Unloading ${PLUGIN_NAME}');
		${CLEANUP}
	}
}
# Vault Ops Scripts

This module supports general tooling for Obsidian vault and project 
administration. The main drive behind creating these scripts is to produce 
a backend project management system that will easily scale and is highly 
adaptable without requiring 18 million plugins. Deep integration with VS 
Code's snippets system is underway, as this will also serve as a storehouse 
of Obsidian-related pieces of code regarding CodeScript Toolkit, Datacore, and 
general plugin development.

# Project Structure

```
scripts/
├── .vscode/
│   ├── snippets/
│   │   ├── javascript.json          # Generated from library/
│   │   ├── typescript.json          # Generated from library/
│   │   ├── jsx.json                 # Generated from library/
│   │   └── tsx.json                 # Generated from library/
│   └── snippets-reference/
│       ├── obsidian-api/
│       │   ├── file-operations.md   # Documentation & examples
│       │   ├── workspace-api.md
│       │   └── plugin-lifecycle.md
│       ├── codescript-toolkit/
│       │   ├── invocable-patterns.md
│       │   ├── code-buttons.md
│       │   └── module-system.md
│       └── dataview/
│           ├── queries.md
│           └── advanced-patterns.md
├── library/
│   ├── javascript/
│   │   ├── obsidian-api/
│   │   │   ├── get-active-file.js
│   │   │   ├── read-file-content.js
│   │   │   └── create-notice.js
│   │   ├── codescript/
│   │   │   ├── invocable-function.js
│   │   │   ├── code-button-basic.js
│   │   │   └── temp-plugin.js
│   │   └── utilities/
│   │       ├── date-formatter.js
│   │       └── string-helpers.js
│   ├── typescript/
│   │   ├── obsidian-api/
│   │   │   ├── plugin-boilerplate.ts
│   │   │   ├── settings-interface.ts
│   │   │   └── modal-class.ts
│   │   ├── codescript/
│   │   │   ├── invocable-typed.ts
│   │   │   ├── advanced-button.ts
│   │   │   └── startup-script.ts
│   │   └── interfaces/
│   │       ├── common-types.ts
│   │       └── config-interfaces.ts
│   ├── jsx/
│   │   └── components/
│   │       ├── react-component.jsx
│   │       └── dashboard-widget.jsx
│   └── tsx/
│       └── components/
│           ├── typed-component.tsx
│           └── settings-panel.tsx
├── classes/
│   ├── NoteManager.ts
│   ├── TemplateProcessor.ts
│   └── DashboardBuilder.ts
├── commands/
│   ├── generate-daily-note.ts
│   ├── update-dashboard.ts
│   └── sync-templates.ts
├── services/
│   ├── file-operations/
│   │   ├── vault-scanner.ts
│   │   └── metadata-extractor.ts
│   ├── template-engine/
│   │   ├── parser.ts
│   │   └── renderer.ts
│   └── dashboard/
│       ├── data-aggregator.ts
│       └── chart-generator.ts
├── build-snippets.js               # Build script
├── snippet-config.json             # Configuration for snippet generation
└── README.md
```

## Key Features

### 1. Organized Library Structure
- **Language-based organization**: Separate folders for JS, TS, JSX, TSX
- **Feature-based subfolders**: Group related functionality
- **Individual files**: Each snippet is a standalone, testable file

### 2. Automated Snippet Generation
- **Build script**: Converts library files to VS Code JSON snippets
- **Configuration-driven**: Easy to add new patterns and prefixes
- **Metadata extraction**: Uses file comments for snippet descriptions

### 3. Reference Documentation
- **Comprehensive guides**: Detailed examples and usage patterns
- **API documentation**: Reference materials for different systems
- **Best practices**: Curated patterns and anti-patterns

### 4. Production Code Organization
- **Classes**: Reusable business logic
- **Commands**: Invocable CodeScript functions
- **Services**: Utility modules and helpers

# Usage Workflow

1. Create snippet files:

```typescript
// library/typescript/codescript/my-snippet.ts
// @snippet-prefix: cs-my-snippet
// @snippet-description: My custom CodeScript snippet

export async function invoke(app: App): Promise<void> {
  ${IMPLEMENTATION}
  ${CURSOR}
}
```

2. Build snippets:

```bash
npm run build:snippets        # One-time build
npm run watch:snippets        # Watch mode for development
npm run dev                   # Alias for watch mode
```

3. Use in VS Code:

Type `cs-my-snippet` + Tab
Fill in placeholders
Final cursor position at `${CURSOR}` (becomes `$0`)

Integration with Your Project
This system integrates perfectly with:

**CodeScript Toolkit** - All your invocable scripts and code buttons
**Git workflow** - Library files are version controlled, generated files can be ignored
**Team collaboration** - Contributors get the same snippets when they run npm run setup

The build script automatically handles the conversion from your readable, maintainable template files into the JSON format VS Code requires, giving you the best of both worlds!
# Testing and Validation System Structure

```
scripts/
├── tests/
│   ├── fixtures/
│   │   ├── valid-snippets/
│   │   │   ├── sample-javascript.js
│   │   │   ├── sample-typescript.ts
│   │   │   └── sample-codescript.ts
│   │   ├── invalid-snippets/
│   │   │   ├── malformed-metadata.js
│   │   │   ├── syntax-error.ts
│   │   │   └── missing-placeholders.js
│   │   └── scripts/
│   │       ├── valid-invocable.ts
│   │       ├── invalid-syntax.ts
│   │       └── missing-exports.js
│   ├── validators/
│   │   ├── snippet-validator.js
│   │   ├── script-validator.js
│   │   ├── metadata-validator.js
│   │   └── syntax-validator.js
│   ├── unit/
│   │   ├── build-snippets.test.js
│   │   ├── metadata-extraction.test.js
│   │   ├── placeholder-processing.test.js
│   │   └── file-operations.test.js
│   ├── integration/
│   │   ├── full-build.test.js
│   │   ├── watch-mode.test.js
│   │   └── config-loading.test.js
│   └── utils/
│       ├── test-helpers.js
│       ├── mock-fs.js
│       └── assertion-helpers.js
├── validate-snippets.js        # Main validation script
├── validate-scripts.js         # Script validation
└── test-runner.js             # Custom test runner
```

## Testing Categories

### 1. Snippet Validation
- **Metadata compliance**: Proper @snippet-* annotations
- **Syntax validation**: JavaScript/TypeScript parsing
- **Placeholder consistency**: VS Code format compliance
- **File structure**: Correct directory placement

### 2. Script Validation  
- **CodeScript compliance**: Proper invoke() exports
- **Type checking**: TypeScript validation
- **Import resolution**: Dependency checking
- **API usage**: Obsidian API compatibility

### 3. Build Process Testing
- **File processing**: Metadata extraction accuracy
- **Output generation**: JSON format validation
- **Error handling**: Graceful failure modes
- **Performance**: Build time optimization

### 4. Integration Testing
- **VS Code compatibility**: Snippet functionality
- **Watch mode**: File change detection
- **Configuration**: snippet-config.json parsing

# For Documentation:

```bash
npm run validate              # Full validation
npm run validate:verbose      # Detailed output  
npm run validate:strict       # Strict mode (fails on warnings)
npm run validate:snippets     # Only snippets
npm run validate:scripts      # Only scripts
npm run test:watch           # Watch mode validation
npm run report               # Generate HTML + JSON reports
npm run doctor               # Full diagnostic report
```


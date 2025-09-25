# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Repository Overview

This is the JavaScript automation submodule (`lvnacy-obsidian-scripts`) for the Obsidian template system. It provides CodeScript Toolkit-based automation, VS Code snippet generation, and Obsidian plugin utilities. This module serves as a Git submodule within the larger template ecosystem.

## Core Architecture

### Package Structure
- **ES Module-based**: Uses modern `import`/`export` syntax with Node.js ES modules
- **Git Submodule**: Standalone repository embedded in Obsidian template vaults
- **VS Code Integration**: Automated snippet generation from library files
- **Obsidian Integration**: CodeScript Toolkit invocable functions and Obsidian API utilities

### Key Systems

#### 1. Snippet Generation System (`build-snippets.js`)
- Converts library JavaScript/TypeScript files to VS Code JSON snippets
- Metadata extraction from special comments (`// @snippet-name`, `// @snippet-prefix`, `// @snippet-description`)
- Placeholder processing (`${VARIABLE}` → `${1:VARIABLE}` for VS Code)
- Multi-language support (JS, TS, JSX, TSX)

#### 2. Library Organization
- **`library-scripts/`**: Core template and service components
- **`utilities/`**: Reusable helper functions and loggers
- **`docs/`**: Documentation and development notes

#### 3. Modal System Architecture
- **`BaseModal`**: Core modal functionality for Obsidian
- **`launchModal`**: Service function for template creation flows
- **Template Integration**: Form-based template creation replacing Templater

#### 4. Logging Infrastructure
- **Dual loggers**: Separate implementations for Obsidian (`logger-obsidian-scripts.js`) and Node.js (`logger-node-scripts.js`)
- **Notice integration**: Obsidian Notice API for user feedback
- **Standard log levels**: Fatal, Error, Warn, Log, Info, Debug, Trace

## Common Development Tasks

### JavaScript Development Workflow

```bash
# Install dependencies
npm install

# Build VS Code snippets from library files
npm run build:snippets

# Development mode with file watching
npm run watch:snippets
# or
npm run dev

# Clean generated snippets
npm run clean

# Validate snippet generation
npm run validate

# Setup after clone
npm run setup
```

### Creating New CodeScript Functions

1. **Create library file with metadata**:
   ```javascript
   // @snippet-name: My Function
   // @snippet-prefix: cs-my-func
   // @snippet-description: Description for VS Code
   
   export async function invoke(app) {
       // Implementation here
   }
   ```

2. **Build snippets**: `npm run build:snippets`
3. **Use in Obsidian**: Create CodeScript code block with the function

### Working with the Modal System

1. **Create template file** in `library-scripts/templates/`:
   ```javascript
   export const templateContent = `# Template Content`;
   export function createForm() {
       // Return form HTML
   }
   ```

2. **Create command file** that imports and uses `launchModal`:
   ```javascript
   import { launchModal } from '../service/launchModal.js';
   import { templateContent, createForm } from '../templates/mytemplate.js';
   ```

### Git Submodule Operations

```bash
# From parent template directory
git submodule update --remote .obsidian/js

# From within js directory
git add .
git commit -m "Update scripts"
git push

# Update parent to reference latest commit
cd ..
git add .obsidian/js
git commit -m "Update js submodule"
```

## Development Context

### Migration Status
- **From Templater**: Gradual migration from Templater to CodeScript Toolkit
- **Current State**: Hybrid system with both Templater and CodeScript functions
- **Target**: Pure CodeScript Toolkit implementation

### Key Dependencies
- **CodeScript Toolkit**: Primary automation framework
- **Obsidian API**: Direct integration with vault operations
- **Chokidar**: File watching for development mode (optional)
- **Node.js ES Modules**: Modern JavaScript module system

### Integration Points
- **Parent Template**: Submodule within larger Obsidian template vault
- **VS Code**: Automated snippet generation for development
- **Obsidian Plugins**: Integration with Dataview, community plugins
- **GitHub**: Standalone repository with independent versioning

## File Structure Notes

- **`package.json`**: Defines npm scripts and ES module configuration
- **`build-snippets.js`**: Main build system with file watching capability
- **`library-scripts/`**: Contains template system and modal services
- **`utilities/`**: Shared utilities including logging and validation
- **`.vscode/snippets/`**: Generated VS Code snippets (not version controlled)
- **`docs/`**: Development documentation and todos

## Debugging and Development

### Common Issues
- **Import/Export**: Ensure all imports use `.js` extension for ES modules
- **File Watching**: Install `chokidar` for automatic rebuilding: `npm install chokidar`
- **Placeholder Syntax**: Use `${VARIABLE}` for snippet placeholders, `$0` for final cursor
- **Modal Development**: Test modal forms thoroughly as they integrate with Obsidian UI

### Development Tools
- Use `npm run dev` for active development with file watching
- Check console output for build errors and snippet generation status
- Test snippets in VS Code before deploying to Obsidian
- Use logger utilities for debugging Obsidian integrations
# CodeScript Snippets

## JavaScript

- `cs-invoke` → Invocable scripts (replaces Templater templates)
- `cs-button` → Code button blocks with YAML config
- `cs-require` → Modern ES module imports with requireAsync
- `cs-note-script` → Embedded scripts in markdown notes
- `cs-temp-plugin` → Temporary plugin prototyping
- `cs-context` → Code button context utilities
- `cs-startup` → Startup scripts with cleanup functions

## TypeScript

- `cs-ts-invoke` → Type-safe invocable functions
- `cs-ts-module` → Full TypeScript module structure
- `cs-advanced-button` → Advanced code buttons with TypeScript support

## Create Snippets
```typescript
// library/typescript/codescript/my-snippet.ts
// @snippet-prefix: cs-my-snippet
// @snippet-description: My custom CodeScript snippet

export async function invoke(app: App): Promise<void> {
  ${IMPLEMENTATION}
  ${CURSOR}
}
```

## Build Snippets

```bash
npm run build:snippets        # One-time build
npm run watch:snippets        # Watch mode for development
npm run dev                   # Alias for watch mode
```

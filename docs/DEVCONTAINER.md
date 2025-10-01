# 🐳 DevContainer Setup Guide

## Quick Start

1. **Open in VS Code**: Open this project in VS Code
2. **Reopen in Container**: Use Command Palette (`Cmd+Shift+P`) → "Dev Containers: Reopen in Container"
3. **Wait for Setup**: Container will build and install dependencies automatically
4. **Start Coding**: All npm scripts now work in the container

## What's Included

### Container Base
- **Node.js 20 Alpine** - Minimal Linux distribution (~5MB base)
- **Git & GitHub CLI** - Version control and GitHub integration  
- **Essential tools** - curl, bash, openssh for development needs

### VS Code Integration
- **ESLint** - Code quality and style checking
- **Prettier** - Code formatting
- **JSON support** - For package.json, snippet configs, etc.

### Available Commands
```bash
# Core development
npm test              # Run tests with Node.js built-in runner
npm run lint          # ESLint validation
npm run build:snippets # Generate VS Code snippets
npm run validate      # Run full validation suite

# Development workflow  
npm run dev           # Watch mode for snippet building
npm run lint:fix      # Auto-fix lint issues
npm run doctor        # Comprehensive health check
```

## VS Code Integration

### Tasks (Ctrl+Shift+P → "Tasks: Run Task")
- **npm: install** - Install dependencies
- **npm: test** - Run test suite
- **npm: lint** - Code quality check
- **npm: build snippets** - Generate snippets
- **npm: validate** - Full validation
- **npm: dev (watch)** - Start watch mode

### Debugging (F5 or Debug Panel)
- **Run Node.js Tests** - Debug test files
- **Run Validation Script** - Debug validation
- **Build Snippets** - Debug build process
- **Debug Current File** - Debug any open .js file

## File System

### Container Mapping
```
Host: /your/project/path
Container: /workspace  (working directory)
```

### Persistent Data
- **VS Code settings** - Synced between container sessions
- **Git configuration** - Uses your host Git config
- **Node modules** - Cached in container for faster rebuilds

## Lean Philosophy Benefits

### Host System Stays Clean
- ✅ No Node.js installation required on host
- ✅ No npm global packages cluttering system
- ✅ No version conflicts with other projects
- ✅ Container can be destroyed/rebuilt anytime

### Consistent Environment
- ✅ Same Node.js version across all developers
- ✅ Same tool versions (ESLint, etc.)
- ✅ Predictable behavior regardless of host OS
- ✅ Easy onboarding for new contributors

### Resource Efficiency
- ✅ Alpine Linux base (~5MB)
- ✅ Only essential packages installed
- ✅ Container stops when VS Code closes
- ✅ No background services running on host

## Troubleshooting

### Container Won't Build
```bash
# Check Docker is running
docker version

# Rebuild container from scratch
Cmd+Shift+P → "Dev Containers: Rebuild Container"
```

### NPM Scripts Failing
```bash
# Check Node.js is available
node --version
npm --version

# Reinstall dependencies
npm install
```

### VS Code Extensions Not Working
```bash
# Extensions install automatically, but if needed:
Cmd+Shift+P → "Extensions: Install Extensions"
```

### Performance Issues
```bash
# Check container resources
docker stats

# If needed, increase Docker memory in Docker Desktop
```

## Advanced Usage

### Custom Docker Image
If you need additional tools, uncomment the Dockerfile reference in `.devcontainer/devcontainer.json`:

```json
{
  "build": {
    "dockerfile": "Dockerfile"
  }
}
```

### Port Forwarding
Add ports to `forwardPorts` array if you need to run servers:

```json
{
  "forwardPorts": [3000, 8080]
}
```

### Additional Features
Add more development tools via features:

```json
{
  "features": {
    "ghcr.io/devcontainers/features/docker-in-docker:1": {}
  }
}
```

## Comparison: Host vs Container Development

| Aspect | Host Development | Container Development |
|--------|------------------|----------------------|
| Setup Time | Complex (install Node, tools) | Simple (open in VS Code) |
| System Impact | High (global installs) | None (isolated) |
| Consistency | Variable (version drift) | Guaranteed (containerized) |
| Cleanup | Manual (uninstall tools) | Automatic (delete container) |
| Collaboration | "Works on my machine" | Identical environments |

## Next Steps

1. **Try the setup** - Open project in container
2. **Run tests** - Verify everything works: `npm test`
3. **Build snippets** - Test core functionality: `npm run build:snippets`  
4. **Customize** - Add any additional tools you need

The container provides a complete, isolated development environment that keeps your host system clean while giving you all the tools you need for the project.
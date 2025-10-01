# 🔧 DevContainer Troubleshooting Guide

## Issue: VS Code Prompts for Manual Setup Instead of Using Configuration

### Quick Fix Steps:

1. **Check for Hidden Files in VS Code**
   - In VS Code Explorer, ensure you can see the `.devcontainer` folder
   - If not visible, check VS Code settings: `files.exclude`

2. **Reload VS Code Window**
   - `Cmd+Shift+P` → "Developer: Reload Window"
   - Try "Dev Containers: Reopen in Container" again

3. **Force Container Rebuild**
   - `Cmd+Shift+P` → "Dev Containers: Rebuild Container"
   - Select "Rebuild Container"

### If Still Prompted for Manual Setup:

1. **Use the Manual Setup BUT Choose These Options:**
   ```
   Base Image: node:20-alpine
   Features to Install:
   - Git
   - GitHub CLI (optional)
   
   Don't install additional tools - we want lean!
   ```

2. **After Manual Setup, Test These Commands:**
   ```bash
   # Check Node.js is available
   node --version
   npm --version
   
   # Test basic npm commands
   npm install
   npm test
   ```

### If Commands Don't Work in Container:

1. **Check Working Directory:**
   ```bash
   pwd
   ls -la
   ```
   Should show your project files

2. **Check Node.js Installation:**
   ```bash
   which node
   which npm
   echo $PATH
   ```

3. **Manual Package Installation:**
   ```bash
   # If npm install didn't run automatically
   npm install
   
   # Test a simple command
   npm run lint
   ```

### If You Get Permission Errors:

1. **Switch to root user temporarily:**
   ```bash
   # In container terminal
   sudo su -
   
   # Install packages as root
   npm install -g npm@latest
   chown -R node:node /workspace/node_modules
   
   # Switch back to node user
   su node
   ```

2. **Or use the simpler config:**
   - Rename `.devcontainer/devcontainer.json` to `.devcontainer/devcontainer-backup.json`
   - Rename `.devcontainer/devcontainer-simple.json` to `.devcontainer/devcontainer.json`
   - Rebuild container

## Alternative: Manual Docker Setup

If devcontainers keep failing, you can run Docker manually:

### 1. Build Container Manually:
```bash
# From your project directory
docker build -t obsidian-dev .devcontainer/

# Run container with volume mount
docker run -it \
  -v $(pwd):/workspace \
  -w /workspace \
  obsidian-dev bash

# Inside container, install dependencies
npm install
npm test
```

### 2. VS Code + Manual Docker:
1. Start container as above but with port mapping:
   ```bash
   docker run -it \
     -v $(pwd):/workspace \
     -w /workspace \
     -p 3000:3000 \
     obsidian-dev bash
   ```

2. In another terminal, attach VS Code:
   ```bash
   code --remote containers /workspace
   ```

## Minimal Working Solution

If all else fails, here's the absolute minimal setup:

### 1. Create `.devcontainer/devcontainer.json`:
```json
{
  "name": "Simple Node",
  "image": "node:20-alpine",
  "postCreateCommand": "npm install"
}
```

### 2. Test This Configuration:
- Remove all other devcontainer files
- Use only this simple config
- Rebuild container
- Should work with basic Node.js + npm

## Verification Steps

Once you have a working container:

```bash
# 1. Verify Node.js
node --version  # Should show v20.x.x
npm --version   # Should show npm version

# 2. Verify project setup  
ls -la          # Should show package.json, library/, tests/, etc.

# 3. Install dependencies
npm install     # Should complete without errors

# 4. Test core functionality
npm run lint    # Should run ESLint
npm test        # Should run tests with node:test
npm run build:snippets  # Should build VS Code snippets

# 5. Check generated files
ls -la .vscode/snippets/  # Should contain generated .json files
```

## Success Indicators

✅ **Container Working Correctly When:**
- `node --version` returns v20.x.x
- `npm test` runs without errors
- `npm run lint` executes ESLint
- `npm run build:snippets` generates snippet files
- VS Code extensions (ESLint) work in container
- Terminal shows proper shell prompt

❌ **Still Having Issues If:**
- Commands not found (node, npm)
- Permission denied errors
- Package.json not found
- VS Code extensions not loading
- File changes not persisting

## Last Resort: Host System Development

If containers continue to be problematic, you can always:

1. **Install Node.js on your Mac:**
   ```bash
   # Using Homebrew (if you have it)
   brew install node
   
   # Or download from nodejs.org
   ```

2. **Use your npm scripts normally:**
   ```bash
   npm install
   npm test
   npm run build:snippets
   ```

But containers are definitely the cleaner approach once working!
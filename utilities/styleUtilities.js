import { Log } from './logger.js';

const logContext = {
	name: 'StyleUtilities',
	path: 'utilities/styleUtilities.js'
};

// Load CSS styles from the vault
export async function loadModalStyles(app) {
	// update log context
	logContext.function = 'loadModalStyles';

	try {
		const cssContent = await app.vault.adapter.read('.obsidian/js/main.css');
		
		// Check if styles are already injected to avoid duplicates
		if (!document.getElementById('modal-styles')) {
			const style = document.createElement('style');
			style.id = 'modal-styles';
			style.textContent = cssContent;
			document.head.appendChild(style);
			Log.log(logContext, '✅ Modal CSS styles loaded successfully');
		} else {
			Log.log(logContext, '📝 Modal CSS styles already loaded');
		}
	} catch (error) {
		Lot.error(logContext, '❌ Failed to load modal styles', error);
	}
}

// Set background image for modal
export function setModalBackground(app, imagePath) {
	// update log context
	logContext.function = 'setModalBackground';
	
	let resourcePath;
	
	try {
		// Method 1: Try using Obsidian's resource path system
		if (app.vault.adapter.getResourcePath) {
			resourcePath = app.vault.adapter.getResourcePath(imagePath);
		} else {
			// Method 2: Fallback to app:// protocol with normalized path
			const vaultPath = app.vault.adapter.basePath;
			resourcePath = `app://local/${vaultPath}/${imagePath}`.replace(/\/\//g, '/');
		}
	} catch (error) {
		Log.error(logContext, 'Error getting resource path:', error);
		// Method 3: Final fallback - simple vault resource URL
		resourcePath = `app://obsidian.md/${imagePath}`;
	}
	
	Log.log(logContext, 'Setting background image path:', resourcePath);
	
	// Set CSS custom property for background image
	document.documentElement.style.setProperty('--modal-bg-image', `url('${resourcePath}')`);
}
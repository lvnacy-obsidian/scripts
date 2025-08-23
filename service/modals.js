import {
    Modal
} from 'obsidian';

// Load CSS styles from the vault
async function loadModalStyles(app) {
    try {
        const cssContent = await app.vault.adapter.read('.obsidian/js/styles/styles.css');
        
        // Check if styles are already injected to avoid duplicates
        if (!document.getElementById('modal-styles')) {
            const style = document.createElement('style');
            style.id = 'modal-styles';
            style.textContent = cssContent;
            document.head.appendChild(style);
            console.log('✅ Modal CSS styles loaded successfully');
        } else {
            console.log('📝 Modal CSS styles already loaded');
        }
    } catch (error) {
        console.error('❌ Failed to load modal styles:', error);
    }
}

// Set background image for modal
function setModalBackground(app, imagePath) {
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
        console.error('Error getting resource path:', error);
        // Method 3: Final fallback - simple vault resource URL
        resourcePath = `app://obsidian.md/${imagePath}`;
    }
    
    console.log('Setting background image path:', resourcePath);
    
    // Set CSS custom property for background image
    document.documentElement.style.setProperty('--modal-bg-image', `url('${resourcePath}')`);
}

export class BaseModal extends Modal {
    resolve;
    reject;
    constructor(app, onSubmit, backgroundImage = null) {
        super(app);
        this.onSubmit = onSubmit;
        this.backgroundImage = backgroundImage;
        
        // Load styles when modal is created
        loadModalStyles(app);
        
        // Set background image if provided
        if (backgroundImage) {
            setModalBackground(app, backgroundImage);
        }
    }

    onOpen() {
        const { modalEl } = this;
        
        // Apply background class to modal
        if (this.backgroundImage) {
            modalEl.addClass('modal-vault-background');
            // Background image styling
            modalEl.style.backgroundImage = `var(--modal-bg-image)`;
            modalEl.style.backgroundSize = 'contain';
            modalEl.style.backgroundPosition = 'center';
            modalEl.style.backgroundRepeat = 'no-repeat';
        } else {
            modalEl.addClass('modal-default-background');
            // Default background color styling
            modalEl.style.backgroundColor = '#c75022';
            modalEl.style.backgroundImage = 'none';
        }
        
        this.createForm();
    }

    createForm() {};

    resolveAndClose(evt, value) {
        // this.submitted = true;
        evt.preventDefault();
        this.resolve(value);
        this.close();
    }

    async openAndGetValue(resolve, reject) {
        this.resolve = resolve;
        this.reject = reject;
        this.open();
    }

}

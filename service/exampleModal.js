import {
    Setting
} from 'obsidian';
import { BaseModal } from "./modals";

class ExampleModal extends BaseModal {
    constructor(app, onSubmit, backgroundImage) {
        super(app, onSubmit, backgroundImage);
    }

    async createForm() {
        const value = {};
        const { contentEl } = this;
        console.log(contentEl);
        
        // Add overlay for better readability on both background image and default color
        // contentEl.addClass('modal-content-overlay');
        
        const form = contentEl.createDiv();
        form.addClass('modalTitle');
        form.createEl('h1', { 
            text: 'WHATEVER',
            // cls: 'league-gothic-italic'
        });
        

        const labels = contentEl.createDiv()
        labels.addClass('modalLabel');

        console.log(Setting);

        new Setting(labels)
            .setClass('avenir-book')
            .setName('blah')
            .setDesc('oh you know, blah')
            .addText(text => {
                text.onChange(result => {
                    value.blah = result;
                })
            });

        new Setting(labels)
            .setClass('avenir-book')
            .setName('other blah')
            .addText(text => {
                text.onChange(result => {
                    value.otherBlah = result;
                })
            })

        new Setting(labels)
            .addButton(button => {
                button
                    .setButtonText('Enter')
                    .setCta()
                    .onClick((evt) => {
                        this.onSubmit(value);
                        this.resolveAndClose(evt, value);
                    });
            });
    }
}

export async function launchModal(app, onSubmit, backgroundImage) {
    const prompt = new ExampleModal(app, onSubmit, backgroundImage);
    const promise = new Promise((resolve, reject) => prompt.openAndGetValue(resolve, reject));

    try {
        return await promise;
    } catch (error) {
        console.log('openAndGetValue error:', error);
        return null;
    }
}
/* eslint-disable no-invalid-this */

import {
	fileManager,
	vault
} from 'obsidian/app';
import { Setting } from 'obsidian';
import { Log } from '../../utilities/logger-obsidian-scripts.js';

// set the logging context
const logCtx = {
	id: 'exampleTemplate',
	name: 'Example Template',
	path: 'set the path to this file'
};

// set the background for the modal
export const bg = '/path/to/image';

/**
 * create the form to collect frontmatter data.
 * see https://docs.obsidian.md/Reference/TypeScript+API/Setting/(constructor)
 * for details on settings options
 * */ 

export function createForm() {

	const value = {};
	const { contentEl } = this;
	Log.info(logCtx, 'contentEl Object:', contentEl);
	
	const form = contentEl.createDiv();
	form.addClass('modalTitle');
	form.createEl('h1', { 
		text: '',
	});
	
	const labels = contentEl.createDiv();
	labels.addClass('modalLabel');

	Log.info(logCtx, 'Setting Object:', Setting);

	// single line text input
	new Setting(labels)
		.setClass('avenir-book')
		.setName('Title1')
		.setDesc(`some description`)
		.addText(text => {
			text.onChange(result => {
				value.name = result;
			});
		});

	// multi-line text input
	new Setting(labels)
		.setClass('avenir-book')
		.setName('Content')
		.setDesc(`Wanna add a description?`)
		.addTextArea(text => {
			text.onChange(result => {
				value.content = result;
			});
		});

	// submit button
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

// flesh out the onSubmit callback
export async function onSubmit(results) {

	// deconstruct the results object
	const { param1, param2 } = results;
	let param;

	// handle any edge cases
	if (!param1) {
		param = '';
	} else {
		param = param1;
	}

	try {
		// create the new file and apply the template content
		// grab the new file identifier for later use
		const newFile = await vault.create('/path/to/new/file.md', templateContent);

		// add the frontmatter
		await fileManager.processFrontMatter(newFile, property => {
			property['property name'] = param;
			property['property name'] = param2;
		});
	} catch(error) {
		Log.error(logCtx, 'Error executing onSumbit:', error);
	}
}
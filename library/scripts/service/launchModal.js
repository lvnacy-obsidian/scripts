import { BaseModal } from './baseModal.js';
import { Log } from '../utilities/logger-obsidian-scripts.js';

// set the logging context
const logCtx = {
	id: 'launchModal',
	name: 'Launch Modal',
	path: 'path to file'
};

export default async function launchModal(app, createForm, onSubmit, backgroundImage) {
	const prompt = new BaseModal(app, createForm, onSubmit, backgroundImage);
	const promise = new Promise((resolve, reject) => prompt.openAndGetValue(resolve, reject));

	try {
		return await promise;
	} catch (error) {
		Log.error(logCtx, 'openAndGetValue error:', error);
		return null;
	}
}
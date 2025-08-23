import { Notice } from 'obsidian';
import { launchModal } from '../service/exampleModal.js';

async function onSubmitCallback(result) {
    new Notice(result);
    return result;
}

const bg = '.obsidian/js/assets/modalbg.jpg';

export async function invoke(app) {

    const blah = await launchModal(app, onSubmitCallback, bg);

    console.log(blah);

}

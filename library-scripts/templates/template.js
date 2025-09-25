/**
 * THIS IS A TEMPLATE FILE
 * Copy and paste this into the commands folder and edit accordingly
*/

import {
    fileManager,
    vault
} from 'obsidian/app';
import launchModal from '../service/launchModal';
import createForm from './name-of-template.js';



// invoke the launchModal function to run the workflow
export async function invoke(app) {
    await launchModal(app, createForm, onSubmit, bg);
}
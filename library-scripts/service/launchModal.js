import { BaseModal } from "./baseModal";

export default async function launchModal(app, createForm, onSubmit, backgroundImage) {
    const prompt = new BaseModal(app, createForm, onSubmit, backgroundImage);
    const promise = new Promise((resolve, reject) => prompt.openAndGetValue(resolve, reject));

    try {
        return await promise;
    } catch (error) {
        console.log('openAndGetValue error:', error);
        return null;
    }
}
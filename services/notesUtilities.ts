import {
    App,
    Notice,
    SuggestModal,
    Vault
} from 'obsidian';
import {
    Edition,
    Project,
    Volume
} from './structures';

class ProjectModal extends SuggestModal<Project> {
    getSuggestions(query: string, projects: Array<string>): Array<Project> {
        return projects.filter((project) => {

        })
    }
}

export default Object.create({}, {

    getProject: {
        value: async function (app: App) {
            const mFiles = await app.vault.getMarkdownFiles();
            
        }
    }

});
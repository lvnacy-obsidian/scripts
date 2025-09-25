## Templates

Is this better than templater? Absolutely the fuck not. However, it *might* be 
in certain use-cases. I'm still working on abstracting bits and pieces of the 
template creation flow, but even in its current form, this suits my personal 
needs better than templater.

Templates are built through forms: 

1. Under the `templates` directory, create a single file that exports the 
    template content and a `createForm` function. The function will be dropped 
    into a modal that will display fields corresponding to the frontmatter of 
    the template.

2. Create a script in the `commands` folder and import the contents of the 
    template and the `launchModal` function and call the function:

    ```javascript
    import { launchModal } from '../service/launchModal.js';
    import { templateContent, createForm } from '../templates/template.js';
    ```

3. Build the `onSubmit` callback to execute file creation and frontmatter 
    management.

4. Create an `invoke(app)` function that calls `launchModal`, and pass in the 
    `createForm()` and `onSubmit` functions. You can also pass a background 
    image for the modal if you so desire.

Ultimately, the template script will look something like this:

```javascript
// some-template.js
import { fileManager, vault } from 'obsidian/app';
import { launchModal } from '../service/launchModal.js';
import { templateContent, createForm } from '../templates/template.js';

// modal background
const bg = '/path/to/background'

// onSubmit callback
async function onSubmit(results) {

    // deconstruct the results object
    const { param1, param2 } = results;

    // create the new file and apply the template content
    // grab the new file identifier for later use
    const newFile = await vault.create('/path/to/new/file.md', templateContent);

    // add the frontmatter
    await fileManager.processFrontMatter(newFile, property => {
        property['property name'] = param1;
        property['property name'] = param2;
    });
}

// invoke the launchModal function and pass everything in
export async function invoke(app) {
    await launchmodal(app, createForm, onSubmit, bg);
}
```

This creates a nice little form to 
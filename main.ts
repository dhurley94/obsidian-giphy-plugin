import { App, MarkdownView, Notice, Modal, PluginSettingTab, Setting, Plugin } from 'obsidian';

interface GiphyPluginSettings {
    apiKey: string;
}

const DEFAULT_SETTINGS: GiphyPluginSettings = {
    apiKey: ''
};

class GiphyImagePickerModal extends Modal {
    private onResolve: (value: string | null) => void;
    private gifUrls: string[];

    constructor(app: App, gifUrls: string[], onResolve: (value: string | null) => void) {
        super(app);
        this.onResolve = onResolve;
        this.gifUrls = gifUrls;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();

        this.gifUrls.forEach(url => {
            const img = contentEl.createEl('img', {
                attr: {
                    src: url,
                    width: '100px',
                    style: 'margin: 5px; cursor: pointer;'
                }
            });
            img.onclick = () => {
                this.onResolve(url);
                this.close();
            };
        });
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}


export default class GiphyPlugin extends Plugin {
    settings: GiphyPluginSettings;

    async onload() {
        this.settings = { ...DEFAULT_SETTINGS, ...(await this.loadData()) }

        this.registerEvent(this.app.workspace.on('active-leaf-change', this.handleActiveLeafChange.bind(this)));

        

        this.addCommand({
            id: 'search-giphy',
            name: 'Search Giphy for GIFs',
            callback: () => this.searchGiphy()
        });

        this.addSettingTab(new GiphyPluginSettingTab(this.app, this));
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    
    async searchGiphy() {
        const keyword = await this.promptForInput();
        if (!keyword) return;
        
        const gifUrls = await this.queryGiphy(keyword);
        if (gifUrls.length === 0) {
            new Notice('No GIFs found.');
            return;
        }
    
        const selectedGifUrl = await this.promptForGifSelection(gifUrls);
        if (!selectedGifUrl) return;
    
        const editor = this.getEditor();
        if (editor) {
            editor.replaceSelection(`![Giphy GIF](${selectedGifUrl})`);
        } else {
            new Notice('Failed to get the editor instance.');
        }
    }
    
    async promptForGifSelection(gifUrls: string[]): Promise<string | null> {
        return new Promise((resolve) => {
            const modal = new GiphyImagePickerModal(this.app, gifUrls, resolve);
            modal.open();
        });
    }
    

    private handleActiveLeafChange(): void {
        const activeLeaf = this.app.workspace.getLeaf();
        if (activeLeaf?.view instanceof MarkdownView) {
            const editor = activeLeaf.view.editor;
            if (editor) {
                editor.exec(this.handleEditorChange.bind(this));
            }
        }
    }
    

    private handleEditorChange(cm: any, change: any): void {
        const insertedText = change?.text?.join('') || '';
        if (insertedText.includes('/giphy')) {
            this.searchGiphy();

            try {
                const from = {
                    line: change.from.line,
                    ch: change.from.ch - 6
                };
                cm.replaceRange('', from, change.from);
            } catch (err) {
                console.error("Error while trying to replace '/giphy':", err);
            }
        }
    }

    async promptForInput(): Promise<string> {
        return new Promise((resolve) => {
            const modal = new GiphySearchModal(this.app, resolve);
            modal.open();
        });
    }

    async queryGiphy(keyword: string, limit = 10): Promise<string[]> {
        const GIPHY_API_ENDPOINT = 'https://api.giphy.com/v1/gifs/search';
        const response = await fetch(`${GIPHY_API_ENDPOINT}?q=${encodeURIComponent(keyword)}&api_key=${this.settings.apiKey}&limit=${limit}`);
        const data = await response.json();
        return data.data.map((gif: {images: {original: {url: string}}}) => gif.images.original.url);
    }
    

    getEditor(): CodeMirror.Editor | null {
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (!view) return null;
        // @ts-ignore
        return view.editor;
    }
}

class GiphyPluginSettingTab extends PluginSettingTab {
    plugin: GiphyPlugin;

    constructor(app: App, plugin: GiphyPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();
        containerEl.createEl('h2', { text: 'Giphy Plugin Settings' });

        new Setting(containerEl)
            .setName('Giphy API Key')
            .setDesc('Enter your Giphy API key')
            .addText(text => text
                .setPlaceholder('Enter your API key...')
                .setValue(this.plugin.settings.apiKey)
                .onChange(async (value) => {
                    this.plugin.settings.apiKey = value;
                    await this.plugin.saveSettings();
                }));
    }
}

class GiphySearchModal extends Modal {
    private onResolve: (value: string) => void;

    constructor(app: App, onResolve: (value: string) => void) {
        super(app);
        this.onResolve = onResolve;
    }

    onOpen() {
        const { contentEl } = this;

        const inputEl = contentEl.createEl('input', {
            type: 'text',
            placeholder: 'Enter keyword to search on Giphy...',
            cls: []
        });

        const submitBtn = contentEl.createEl('button', {
            text: 'Search',
            cls: []
        });

        inputEl.addEventListener('keydown', (event: KeyboardEvent) => {
            console.log(event)
            if (event.key === 'Enter') {
                this.onResolve(inputEl.value);
                this.close();
            }
        });

        submitBtn.onclick = () => {
            this.onResolve(inputEl.value);
            this.close();
        };
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

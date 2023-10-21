import { App, MarkdownView, Notice, Modal, PluginSettingTab, Setting, Plugin } from 'obsidian';

interface GiphyPluginSettings {
    apiKey: string;
}

const DEFAULT_SETTINGS: GiphyPluginSettings = {
    apiKey: ''
};

export default class GiphyPlugin extends Plugin {
    settings: GiphyPluginSettings;

    async onload() {
        this.settings = { ...DEFAULT_SETTINGS, ...(await this.loadData()) }

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
        
        const gifUrl = await this.queryGiphy(keyword);
        if (!gifUrl) {
            return new Notice('No GIF found.');
        }

        const editor = this.getEditor();
        if (editor) {
            editor.replaceSelection(`![Giphy GIF](${gifUrl})`);
        } else {
            return new Notice('Failed to get the editor instance.');
        }
    }

    async promptForInput(): Promise<string> {
        return new Promise((resolve) => {
            const modal = new GiphyInputModal(this.app, resolve);
            modal.open();
        });
    }

    async queryGiphy(keyword: string): Promise<string> {
        const GIPHY_API_ENDPOINT = 'https://api.giphy.com/v1/gifs/search';
        const response = await fetch(`${GIPHY_API_ENDPOINT}?q=${encodeURIComponent(keyword)}&api_key=${this.settings.apiKey}&limit=1`);
        const data = await response.json();
        return data.data[0]?.images?.original?.url || '';
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

class GiphyInputModal extends Modal {
    private onResolve: (value: string) => void;

    constructor(app: App, onResolve: (value: string) => void) {
        super(app);
        this.onResolve = onResolve;
    }

    onOpen() {
        const { contentEl } = this;

        const inputEl = contentEl.createEl('input', {
            type: 'text',
            placeholder: 'Enter keyword to search on Giphy...'
        });

        const submitBtn = contentEl.createEl('button', {
            text: 'Search'
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

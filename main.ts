import { MarkdownView, Notice, Plugin as ObsidianPlugin } from 'obsidian';
import { GiphyImagePickerModal } from 'ui/image-picker';
import { GiphyPluginSettingTab } from 'ui/plugin-settings';
import { GiphySearchModal } from 'ui/search-modal';

interface GiphyPluginSettings {
  apiKey: string;
  imageCount: number;
}

const DEFAULT_SETTINGS: GiphyPluginSettings = {
  apiKey: '',
  imageCount: 5,
};

export default class GiphyPlugin extends ObsidianPlugin {
  settings: GiphyPluginSettings;

  async onload() {
    this.settings = { ...DEFAULT_SETTINGS, ...(await this.loadData()) };

    this.registerEvent(this.app.workspace.on('active-leaf-change', this.handleActiveLeafChange.bind(this)));

    this.addCommand({
      id: 'search-giphy',
      name: 'Search Giphy for GIFs',
      callback: () => this.searchGiphy(),
    });

    this.addSettingTab(new GiphyPluginSettingTab(this.app, this));
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

    
  async searchGiphy() {
    const keyword = await this.promptForInput();
    if (!keyword) { return; }
        
    const gifUrls = await this.queryGiphy(keyword, this.settings.imageCount);
    if (gifUrls.length === 0) {
      new Notice('No GIFs found.');
      return;
    }
    
    const selectedGifUrl = await this.promptForGifSelection(gifUrls);
    if (!selectedGifUrl) { return; }
    
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
          ch: change.from.ch - 6,
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

  async queryGiphy(keyword: string, limit = 3): Promise<string[]> {
    const GIPHY_API_ENDPOINT = 'https://api.giphy.com/v1/gifs/search';
    const response = await fetch(`${GIPHY_API_ENDPOINT}?q=${encodeURIComponent(keyword)}&api_key=${this.settings.apiKey}&limit=${limit}`);
    const data = await response.json();
    return data.data.map((gif: { images: { original: { url: string } } }) => gif.images.original.url);
  }

  getEditor(): CodeMirror.Editor | null {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!view) { return null; }
    return view.editor as any;
  }
}

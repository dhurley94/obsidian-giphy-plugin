import { Editor, MarkdownView, Notice, Plugin as ObsidianPlugin } from 'obsidian';
import { GiphyImagePickerModal } from './ui/image-picker';
import { GiphyPluginSettingTab } from './ui/plugin-settings';
import { GiphySearchModal } from './ui/search';
import { GiphyApiClient, GiphyService } from './api';

export interface GiphyPluginSettings {
  apiKey: string;
  imageCount: number;
  imageCss: string;
  imageSize: string;
  slashCommands: string[];
  history?: { keyword: string, searchedAt: string }[];
}

export const DEFAULT_SETTINGS: GiphyPluginSettings = {
  apiKey: '',
  imageCount: 5,
  imageSize: '95px',
  imageCss: 'margin: 3px; cursor: pointer; border: 2px solid gray;',
  slashCommands: [
    'giphy',
    'gif',
  ],
  history: [],
};

export default class GiphyPlugin extends ObsidianPlugin {
  settings: GiphyPluginSettings;

  private giphyClient: GiphyApiClient;

  public giphyService: GiphyService;

  private cursor: CodeMirror.Position;

  async onload() {
    this.settings = { ...DEFAULT_SETTINGS, ...(await this.loadData()) };
      
    this.giphyClient = new GiphyApiClient(this.settings.apiKey);
    this.giphyService = new GiphyService(this.giphyClient);

    this.addCommand({
      id: 'giphy-search',
      name: 'Giphy Search',
      callback: () => this.searchGiphy(),
    });

    this.addRibbonIcon('image-play', 'Giphy Search', () => this.searchGiphy());

    this.addSettingTab(new GiphyPluginSettingTab(this.app, this));
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  async searchGiphy() {
    // Save the current cursor position
    const editor = this.getEditor();
    if (editor) {
      this.cursor = editor.getCursor();
    }
			
    const keyword = await this.promptForInput();
    if (!keyword) return;

    const gifUrls = await this.giphyService.queryGiphy(keyword, this.settings.imageCount);
    // this.get({history: })
    if (!gifUrls) {
      new Notice('No GIFs found.').setMessage('No GIFs found.');
      return;
    }
	
    const selectedGifUrl = await this.promptForGifSelection(gifUrls);
    if (!selectedGifUrl) return;
	
    // Restore the cursor position
    if (editor && this.cursor) {
      editor.setCursor(this.cursor);
    }
	
    // Insert the selected image at the current cursor location
    editor?.replaceRange(`![Giphy GIF](${selectedGifUrl})`, this.cursor);
  }
	
  async promptForGifSelection(gifUrls: string[]): Promise<string | null> {
    return new Promise((resolve) => {
      const modal = new GiphyImagePickerModal(this.app, this, gifUrls, resolve);
      modal.open();
    });
  }

  private handleActiveLeafChange(): void {
    const activeLeaf = this.app.workspace.getLeaf();
    if (activeLeaf?.view instanceof MarkdownView) {
      const editor = activeLeaf.view.editor;
      if (editor) {
        // do nothing
        // editor.exec(this.handleSlashCommand.bind(this));
        // editor.exec(this.handleCursorActivity.bind(this));
      }
    }
  }

  private handleCursorActivity(editor: Editor): void {
    const cursor = editor.getCursor();
    const line = editor.getLine(cursor.line);
    const match = line.match(/!\[.*?\]\(.*?\)/);

    if (match) {
      const startIndex = match.index;
      if (startIndex) {
        const endIndex = startIndex + match[0].length;

        if (cursor.ch >= startIndex && cursor.ch <= endIndex) {
          editor.setSelection(
            { line: cursor.line, ch: startIndex },
            { line: cursor.line, ch: endIndex },
          );
        }
      }
    }
  }

  /**
   * Stopped working after svelte migration.
   * 
   * @param cm 
   * @param change 
   */
  private handleSlashCommand(cm: any, change: any) {
    const insertedText: string = change?.text?.join('') || '';
    // if (insertedText.includes('/giphy')) {
    if (DEFAULT_SETTINGS.slashCommands.filter((command) => insertedText.includes(`/${command}`))) {
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
      const modal = new GiphySearchModal(this.app, this, resolve);
      modal.open();
    });
  }
  
  getEditor(): CodeMirror.Editor | null {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!view) { return null; }
    return view.editor as any;
  }
}


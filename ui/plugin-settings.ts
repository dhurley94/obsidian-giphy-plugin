import GiphyPlugin, { DEFAULT_SETTINGS } from 'main';
import { App, PluginSettingTab, Setting } from 'obsidian';

export class GiphyPluginSettingTab extends PluginSettingTab {
  constructor(app: App, private plugin: GiphyPlugin) {
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

    new Setting(containerEl)
      .setName('Limit Image Count')
      .setDesc('Giphy Images Loaded from Query')
      .addText(text => text
        .setPlaceholder('5')
        .setValue(this.plugin.settings.imageCount.toString())
        .onChange(async (value) => {
          this.plugin.settings.imageCount = Number(value);
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName('Image CSS')
      .setDesc('Customize how GIFs are displayed in a document.')
      .addText(text => text
        .setPlaceholder(DEFAULT_SETTINGS.imageCss)
        .setValue(this.plugin.settings.imageCss.toString())
        .onChange(async (value) => {
          this.plugin.settings.imageCss = value;
          await this.plugin.saveSettings();
        }));
    
    new Setting(containerEl)
      .setName('Image Size')
      .setDesc('Customize the GIFs size in px.')
      .addText(text => text
        .setPlaceholder(DEFAULT_SETTINGS.imageSize)
        .setValue(this.plugin.settings.imageSize.toString())
        .onChange(async (value) => {
          this.plugin.settings.imageSize = value;
          await this.plugin.saveSettings();
        }));
  }
}

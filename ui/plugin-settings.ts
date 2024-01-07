import GiphyPlugin from 'main';
import { App, PluginSettingTab, Setting } from 'obsidian';

export class GiphyPluginSettingTab extends PluginSettingTab {
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
  }
}

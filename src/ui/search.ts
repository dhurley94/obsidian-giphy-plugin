import GiphyPlugin from '..';
import { App, Modal } from 'obsidian';
import SearchComponent from './svelte/search.svelte';

export class GiphySearchModal extends Modal {
  searchComponent: SearchComponent;

  constructor(
    app: App,
    private plugin: GiphyPlugin,
    private onResolve: (value: string) => void,
  ) {
    super(app);
    this.onResolve = onResolve;
  }

  async onOpen() {
    const { contentEl } = this;
    contentEl.empty();

    this.searchComponent = new SearchComponent({
      target: contentEl,
      props: {
        onResolve: this.onResolve,
        onClose: () => {
          this.close.bind(this);
          this.close();
        },
      },
    });
  }

  async onClose() {
    this.searchComponent.$destroy();
  }
}

import GiphyPlugin from '..';
import { App, Modal } from 'obsidian';
import SearchComponent from './svelte/search.svelte';

export class GiphySearchModal extends Modal {
  constructor(
    app: App,
    private plugin: GiphyPlugin,
    private onResolve: (value: string) => void,
  ) {
    super(app);
    this.onResolve = onResolve;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();

    new SearchComponent({
      target: contentEl,
      props: {
        onResolve: this.onResolve,
        onClose: () => {
          this.close.bind(this);
          this.close();
        },
      },
    });

  //   const inputEl = contentEl.createEl('input', {
  //     type: 'text',
  //     placeholder: 'Enter keyword to search on Giphy...',
  //     cls: ['.search-input'],
  //   });

  //   const submitBtn = contentEl.createEl('button', {
  //     text: 'Search',
  //     cls: ['.search-button'],
  //   });

  //   inputEl.addEventListener('keydown', (event: KeyboardEvent) => {
  //     console.log(event);
  //     if (event.key === 'Enter') {
  //       this.onResolve(inputEl.value);
  //       this.close();
  //     }
  //   });

  //   submitBtn.onclick = () => {
  //     this.onResolve(inputEl.value);
  //     this.close();
  //   };
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}

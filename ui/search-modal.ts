import { App, Modal } from 'obsidian';

export class GiphySearchModal extends Modal {
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
      cls: [],
    });

    const submitBtn = contentEl.createEl('button', {
      text: 'Search',
      cls: [],
    });

    inputEl.addEventListener('keydown', (event: KeyboardEvent) => {
      console.log(event);
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

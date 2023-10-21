import { App, Modal } from 'obsidian';

export class GiphyImagePickerModal extends Modal {
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
          style: 'margin: 5px; cursor: pointer;',
        },
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

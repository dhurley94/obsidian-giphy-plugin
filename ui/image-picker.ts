import { App, Modal, Setting } from 'obsidian';

export class GiphyImagePickerModal extends Modal {
  selectedImageEl: HTMLImageElement | null = null;

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
          width: '95px',
          style: 'margin: 3px; cursor: pointer; border: 2px solid gray;',
        },
      });

      img.onclick = () => {
        this.onResolve(url);
        this.close();
      };
    });

    new Setting(contentEl).addButton(btn =>
      btn
        .setIcon('refresh-ccw')
        .onClick(evt => console.log)
      )
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}

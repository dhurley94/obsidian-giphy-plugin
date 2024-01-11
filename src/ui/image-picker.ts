import GiphyPlugin from '..';
import { App, Modal, Setting } from 'obsidian';

export class ImageContentMananger {
  private imageContent: HTMLImageElement[] = [];

  constructor(private contentEl: HTMLElement, private plugin: GiphyPlugin) {}

  remove(url?: string, idx?: number) {
    if (idx) this.imageContent[idx].remove();
    this.imageContent.filter((img) => img.src === url)[0].remove();
  }

  removeAll() {
    this.imageContent.forEach(img => img.remove());
  }

  add(url: string) {
    const image = this.imageContent.push(this.contentEl.createEl('img', {
      cls: '.giphyPluginImage',
      title: '',
      attr: {
        src: url,
        width: this.plugin.settings.imageSize,
        style: `${this.plugin.settings.imageCss}`,
      },
    }));
    return this.imageContent[image];
  }

  list() {
    return this.imageContent;
  }
}

export class GiphyImagePickerModal extends Modal {
  selectedImageEl: HTMLImageElement | null = null;

  imageContent: ImageContentMananger;

  constructor(
    app: App,
    private plugin: GiphyPlugin,
    private gifUrls: string[],
    private onResolve: (value: string | null) => void,
  ) {
    super(app);
    this.onResolve = onResolve;
    this.gifUrls = gifUrls;
    this.imageContent = new ImageContentMananger(this.contentEl, this.plugin);
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    
    new Setting(contentEl).addButton(btn =>
      btn
        .setIcon('refresh-ccw')
        .onClick(async () => {
          const newGifUrls = await this.plugin.giphyService.queryGiphy(this.plugin.giphyService.getLastKeyword(), this.plugin.settings.imageCount);
          this.imageContent.removeAll();
          newGifUrls?.forEach(url => this.imageContent.add(url));
          this.imageContent.list().forEach(img => img.onclick = () => {
            this.onResolve(img.src);
            this.close();
          });
        }),
    );
    
    this.gifUrls.forEach(url => {
      this.imageContent.add(url);
      this.imageContent.list().forEach(img => img.onclick = () => {
        this.onResolve(url);
        this.close();
      });
    });
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}

// import { App, Modal, Setting } from 'obsidian';

// // Image source interface
// interface ImageSource {
//   getImages(): Promise<string[]>;
// }

// // GiphyImageSource class
// class GiphyImageSource implements ImageSource {
//   private gifUrls: string[];

//   constructor(gifUrls: string[]) {
//     this.gifUrls = gifUrls;
//   }

//   async getImages(): Promise<string[]> {
//     return this.gifUrls;
//   }
// }

// // ImagePickerModal class
// export class GiphyImagePickerModal extends Modal {
//   private imageSource: ImageSource;

//   private onImageSelect: (url: string) => void;

//   private onRefresh: () => void;

//   constructor(app: App, imageSource: ImageSource, onImageSelect: (url: string) => void, onRefresh: () => void) {
//     super(app);
//     this.imageSource = imageSource;
//     this.onImageSelect = onImageSelect;
//     this.onRefresh = onRefresh;
//   }

//   async onOpen() {
//     const { contentEl } = this;
//     contentEl.empty();

//     const urls = await this.imageSource.getImages();
//     urls.forEach(url => {
//       const img = contentEl.createEl('img', {
//         attr: {
//           src: url,
//           width: '95px',
//           style: 'margin: 3px; cursor: pointer; border: 2px solid gray;',
//         },
//       });

//       img.onclick = () => {
//         this.onImageSelect(url);
//         this.close();
//       };
//     });

//     new Setting(contentEl).addButton(btn =>
//       btn.setIcon('refresh-ccw').onClick(() => this.onRefresh()),
//     );
//   }

//   onClose() {
//     const { contentEl } = this;
//     contentEl.empty();
//   }
// }



// // // Usage
// // export const modal = new ImagePickerModal(
// //   app,
// //   new GiphyImageSource([]),
// //   (url) => { /* handle image selection */ },
// //   () => { /* handle refresh */ },
// // );

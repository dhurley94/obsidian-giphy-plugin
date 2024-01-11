import GiphyPlugin from 'main';
import { App, Modal, Setting } from 'obsidian';

export class GiphyImagePickerModal extends Modal {
  selectedImageEl: HTMLImageElement | null = null;

  constructor(
    app: App,
    private plugin: GiphyPlugin,
    private gifUrls: string[],
    private onResolve: (value: string | null) => void,
  ) {
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
          width: this.plugin.settings.imageSize,
          style: `${this.plugin.settings.imageCss}`,
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
        .onClick(() => {
          console.log('refresh click');
        }),
    );
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

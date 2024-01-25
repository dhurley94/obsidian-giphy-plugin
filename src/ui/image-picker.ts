import GiphyPlugin from '..';
import { App, Modal } from 'obsidian';
import ImagePickerComponent from './svelte/image-picker.svelte'; 
import { imageStore } from '../store';

export const VIEW_TYPE = 'image-picker-view';

export class GiphyImagePickerModal extends Modal {
  selectedImageEl: HTMLImageElement | null = null;

  imagePickerComponent: ImagePickerComponent | null = null;

  constructor(
    app: App,
    private plugin: GiphyPlugin,
    private gifUrls: string[],
    private onResolve: (value: string | null) => void,
  ) {
    super(app);
    this.onResolve = onResolve;
    this.gifUrls = gifUrls;
    imageStore.set(this.gifUrls);
  }

  async onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    
    // new Setting(contentEl).addButton(btn =>
    //   btn
    //     .setIcon('refresh-ccw')
    //     .onClick(async () => {
    //       const newGifUrls = await this.plugin.giphyService.queryGiphy(this.plugin.giphyService.getLastKeyword(), this.plugin.settings.imageCount);
    //       this.imageContent.removeAll();
    //       newGifUrls?.forEach(url => this.imageContent.add(url));
    //       this.imageContent.list().forEach(img => img.onclick = () => {
    //         this.onResolve(img.src);
    //         this.close();
    //       });
    //     }),
    // );
    
    this.imagePickerComponent = new ImagePickerComponent({
      target: this.contentEl,
      props: {
        images: this.gifUrls,
        imageSize: this.plugin.settings.imageSize,
        onResolve: this.onResolve,
        onClose: () => {
          this.close.bind(this);
          this.close();
        },
        onRefresh: async (): Promise<string[]> => {
          const images = await this.plugin.giphyService.queryGiphy(this.plugin.giphyService.getLastKeyword(), this.plugin.settings.imageCount);
          if (images) {
            return images;
          }
          return [];
        },
      },
    });
  }


  async onClose() {
    this.imagePickerComponent?.$destroy();
  }
}

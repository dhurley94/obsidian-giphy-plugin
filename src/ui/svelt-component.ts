import { ItemView, WorkspaceLeaf } from 'obsidian';

import Component from './svelte/Component.svelte';
import GiphyPlugin from 'src';

export const VIEW_TYPE_EXAMPLE = 'example-view';

export class ExampleView extends ItemView {
  component: Component;

  constructor(leaf: WorkspaceLeaf, private plugin: GiphyPlugin) {
    super(leaf);
  }

  getViewType() {
    return VIEW_TYPE_EXAMPLE;
  }

  getDisplayText() {
    return 'Example view';
  }

  async onOpen() {
    this.component = new Component({
      target: this.contentEl,
      props: {
        variable: 1,
      },
    });
  }

  async onClose() {
    this.component.$destroy();
  }
}
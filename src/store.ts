import { writable } from 'svelte/store';
import GiphyPlugin from './index';

export const pluginStore = writable<GiphyPlugin>();
export const imageStore = writable<string[]>();

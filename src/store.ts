import { writable } from 'svelte/store';
import GiphyPlugin from './index';

const plugin = writable<GiphyPlugin>();
export default { plugin };
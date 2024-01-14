<script lang="ts">
  import { RefreshCw } from 'lucide-svelte';
  export let images = [];
  export let imageSize = "";

  export let lastKeywordSearch: string;
  
  export let onResolve: (url: string) => void
  export let onClose: () => void


  export let onRefresh: (keyword?: string) => string[]

  export let closeAfterResolve = (url: string) => {
    onResolve(url)
    onClose()
  }
</script>
  
<div>
  <input bind:value={lastKeywordSearch} />
  <button class=".refresh" on:click={onRefresh(lastKeywordSearch)}><RefreshCw/></button>
  <div class="image-gallery">
    {#each images as image}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
      <img on:click={() => closeAfterResolve(image)} class=".giphyPluginImage" src={image} alt={image} width={imageSize} />
    {/each}
  </div>
</div>


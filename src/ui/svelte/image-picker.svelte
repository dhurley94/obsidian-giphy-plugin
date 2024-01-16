<script lang="ts">
  import { RefreshCw } from 'lucide-svelte';
  export let images: string[] = [];
  export let imageSize: string = "";

  export let lastKeywordSearch: string;
  
  export let onResolve: (url: string) => void
  export let onClose: () => void


  export let onRefresh: (keyword?: string) => string[]
  // export let onRefresh: (keyword?: string) => {
  //   console.log("do a refresh thing")
  //   return string[]
  // }

  export let closeAfterResolve = (url: string) => {
    onResolve(url)
    onClose()
  }

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      closeAfterResolve(lastKeywordSearch);
    }
  };
</script>
  
<div>
  <input class="search-input" bind:value={lastKeywordSearch} on:keydown={(e) => handleKeydown(e)}/>
  <button class="refresh-btn" on:click={() => onRefresh(lastKeywordSearch)}><RefreshCw/></button>
  <div class="image-gallery">
    {#each images as image}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
      <img on:click={() => closeAfterResolve(image)} class="giphyPluginImage" src={image} alt={image} width={imageSize} />
    {/each}
  </div>
</div>


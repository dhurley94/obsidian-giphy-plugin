<script lang="ts">
  export let keywordSearch: string;
  export let onResolve: (keyword: string) => void;
  export let onClose: () => void;

  export let closeAfterSearch = (keyword: string) => {
    onResolve(keyword);
    onClose();
  }

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      closeAfterSearch(keywordSearch);
    }
  };
</script>

<div>
  <input class="search-input" bind:value={keywordSearch} on:keydown={handleKeydown} />
  <button class="search-btn" on:click={() => closeAfterSearch(keywordSearch)}>Enter</button>
</div>

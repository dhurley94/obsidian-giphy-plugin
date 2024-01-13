<script>
  export let images = [];
  export let imageSize = "";
  
  function incrementCount() {
		count++
	}
</script>

<!-- HTML to display the images -->
<div class="image-gallery">
  <p>Testing this renders</p>
  {#each images as image}
    <img on:click={onResolve} class=".giphyPluginImage" src={image} alt={image} width={imageSize} />
  {/each}
</div>


<script lang="ts">
import {
  Button,
  Input,
  Container,
  Col,
  Row,
} from '@sveltestrap/sveltestrap';

import {
  RefreshCw
} from 'lucide-svelte';

export let images: string[] = [];
export let imageSize: string = "";

export let lastKeywordSearch: string;

export let onResolve: (url: string) => void
export let onClose: () => void

export let onRefresh: (keyword ? : string) => string[]
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

<Container fluid>
    <Row>
        <Col>
        <Input color="primary" bind:value={lastKeywordSearch} on:keydown={(e) => handleKeydown(e)}/>
        <Button color="primary" on:click={() => onRefresh(lastKeywordSearch)}><RefreshCw /></Button>
            </Col>
            </Row>

            <Row>
                <div class="image-gallery">
                    {#each images as image}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                    <img on:click={() => closeAfterResolve(image)} class="giphy-image" src={image} alt={image} width={imageSize} />
                {/each}
                </div>
            </Row>

            </Container>

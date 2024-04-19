<script lang="ts">
import {
  Styles,
  Button,
  Input,
  Container,
  Row,
  Col,

} from '@sveltestrap/sveltestrap';
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

<Styles />

<Container lg>
    <Row>
        <Input class="search-input" bind:value={keywordSearch} on:keydown={handleKeydown} />
        <Button class="search-btn" color="primary" outline on:click={() => closeAfterSearch(keywordSearch)}>Enter</Button>
    </Row>
</Container>

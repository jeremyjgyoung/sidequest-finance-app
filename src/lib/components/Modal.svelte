<script lang="ts">
  import { onMount, type Snippet } from 'svelte';
  import Icon from './Icon.svelte';
  let {
    title,
    subtitle = '',
    onclose,
    children,
  }: {
    title: string;
    subtitle?: string;
    onclose: () => void;
    children: Snippet;
  } = $props();
  let element: HTMLDialogElement;
  onMount(() => {
    element.showModal();
    element.querySelector<HTMLInputElement>('input')?.focus();
    return () => element.close();
  });
</script>

<dialog bind:this={element} {onclose} oncancel={onclose} aria-label={title}>
  <div class="modal-inner">
    <button
      class="icon-button modal-close"
      aria-label="Close dialog"
      onclick={onclose}><Icon name="close" /></button
    >
    <div class="modal-heading">
      <span class="small-icon gold"><Icon name="sparkles" size={22} /></span>
      <h2>{title}</h2>
    </div>
    {#if subtitle}<p class="modal-subtitle muted">{subtitle}</p>{/if}
    {@render children()}
  </div>
</dialog>

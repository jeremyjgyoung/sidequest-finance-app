<script lang="ts">
  import Dashboard from '#lib/components/Dashboard.svelte';
  import { demo } from '#lib/demo/controller.svelte.js';
</script>

{#if demo.state}<Dashboard />{/if}

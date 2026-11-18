<script lang="ts">
  import Dashboard from '#lib/components/Dashboard.svelte';
  import { demo } from '#lib/demo/controller.svelte.js';
</script>

<svelte:head>
  <title
    >{demo.state?.role === 'parent' ? 'Family overview' : 'Your next adventure'} —
    Sidequest</title
  >
</svelte:head>

{#if demo.state}<Dashboard />{/if}

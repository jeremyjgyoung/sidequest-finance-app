<script lang="ts">
  import { demo } from '#lib/demo/controller.svelte.js';
  import ActivityList from '#lib/components/ActivityList.svelte';
  import Icon from '#lib/components/Icon.svelte';
  let filter = $state('all');
  const entries = $derived(
    demo.state?.ledger
      .filter((e) => filter === 'all' || e.goalId === demo.state!.currentId)
      .toReversed() ?? [],
  );
</script>

<svelte:head><title>Activity — Sidequest</title></svelte:head>
{#if demo.state}<div class="page-intro">
    <div>
      <p class="eyebrow">EVERY LITTLE MOVE MATTERS</p>
      <h1>Your savings story.</h1>
      <p class="muted page-description">
        Every deposit, boost, and milestone. All in one place.
      </p>
    </div>
    <span class="chapter-label"
      ><Icon name="activity" size={16} />{entries.length} entries</span
    >
  </div>
  <section class="card ledger-card">
    <div class="card-heading">
      <h2>A trail of progress</h2>
      <div class="filter-toggle">
        <button class:active={filter === 'all'} onclick={() => (filter = 'all')}
          >All activity</button
        ><button
          class:active={filter === 'goal'}
          onclick={() => (filter = 'goal')}>This goal</button
        >
      </div>
    </div>
    <ActivityList {entries} state={demo.state} full />
  </section>{/if}

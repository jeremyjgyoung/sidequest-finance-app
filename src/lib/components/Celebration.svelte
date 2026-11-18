<script lang="ts">
  import { onMount } from 'svelte';
  import Icon from './Icon.svelte';
  let { title }: { title: string } = $props();
  let shower = $state(true);
  onMount(() => {
    const timer = setTimeout(() => (shower = false), 6500);
    return () => clearTimeout(timer);
  });
</script>

<section class="celebration-banner" aria-label="Goal celebration">
  <span class="celebration-trophy"><Icon name="gift" size={30} /></span>
  <div>
    <p class="eyebrow">SAVINGS QUEST: ACCOMPLISHED</p>
    <h2>{title} unlocked!</h2>
    <p>
      Every little deposit brought you here. Time to celebrate your big win.
    </p>
  </div>
  <span class="celebration-stars" aria-hidden="true">✦ ✧ ✦</span>
</section>
{#if shower}<div class="coin-confetti" aria-hidden="true">
    {#each Array.from({ length: 32 }, (_, i) => i) as i}<span
        class="confetti-coin"
        style:left={`${(i * 37) % 98}%`}
        style:--drift={`${(i % 2 ? 1 : -1) * (25 + i * 3)}px`}
        style:animation-delay={`${(i % 9) * 0.11}s`}
        style:animation-duration={`${2.8 + (i % 6) * 0.35}s`}
      ></span>{/each}
  </div>{/if}
